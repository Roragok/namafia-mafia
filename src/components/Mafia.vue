<template>
  <div class="main-wrapper">
    <h1>{{ msg }} </h1>
    <div v-if="highlightLoading" class="text-center">
      <b-spinner label="Spinning"></b-spinner>
    </div>
    <b-jumbotron
      v-else
      >
      <b-link :href="removePostID(highlight.day_url)">
        <h2 class="display-4 text-info">{{ highlight.day_title}}</h2>
      </b-link>

      <b-list-group v-for="(votes, index) in voteCounts"
        :key="index"
        >
        <b-list-group-item v-b-toggle="'highlight-collapse-' + index" v-if="votes.target != 'Not Voting'" class="d-flex justify-content-between align-items-center">
          {{ votes.target }}
          <b-badge variant="danger" pill>{{ votes.voted.length }}</b-badge>
        </b-list-group-item>
        <b-collapse class="highlight-vote-wrapper" :id="'highlight-collapse-'+ index">
          <b-card>
            <ul>
              <li v-for="(player) in votes.voted" :key="player.postID">
                <b-link v-if="player.postID" :href="removePostID(highlight.day_url)+'/'+player.postID">{{ player.voter }}</b-link>
                <span v-else>{{ player.voter }} </span>
              </li>
            </ul>
          </b-card>
        </b-collapse>
        <b-list-group-item v-b-toggle="'highlight-collapse-nv'" v-if="notVoting && (index+1) == voteCounts.length" class="d-flex justify-content-between align-items-center">
          {{ "Not Voting" }}
          <b-badge variant="danger" pill>{{ notVotingArray.length }}</b-badge>
        </b-list-group-item>
        <b-collapse class="highlight-vote-wrapper" :id="'highlight-collapse-nv'" v-if="notVoting && (index+1) == voteCounts.length">
          <b-card>
            <ul>
              <li v-for="(player) in notVotingArray" :key="player.postID">
                {{ player.voter }}
              </li>
            </ul>
          </b-card>
        </b-collapse>
      </b-list-group>
    </b-jumbotron>
    <b-tabs content-class="mt-3">
      <b-tab title="Active Games" active>
        <div class="mafia-games">
          <div v-if="loading" class="text-center">
            <b-spinner label="Spinning"></b-spinner>
          </div>
          <b-list-group class="mafia-game"
            v-else
            v-for="(game, index) in activeGames"
            v-bind:key="game.game_id"
            >
            <b-list-group-item v-if="index !==0" v-b-toggle="'active-collapse-' + index" class="d-flex justify-content-between align-items-center">
              {{game.title}}
            </b-list-group-item>
            <b-collapse :id="'active-collapse-'+ index">
              <b-card>
                  {{ game.host }}
                <ul>
                  <li
                    v-for="player in game.signed_players"
                    v-bind:key="player"
                    >
                    {{ player }}
                  </li>
                </ul>
              </b-card>
            </b-collapse>
          </b-list-group>
        </div>
      </b-tab>
      <b-tab title="Closed Games">
        <div class="mafia-games">
          <div v-if="loading">Loading...</div>
          <b-list-group  class="mafia-game"
            v-else
            v-for="(game, index) in finishedGames"
            v-bind:key="game.game_id"
            >
            <b-list-group-item v-b-toggle="'collapse-' + index" class="d-flex justify-content-between align-items-center">
              {{ game.title}}
            </b-list-group-item>
            <b-collapse :id="'collapse-'+ index">
              <b-card>
                {{ game.host }}
                <ul>
                  <li
                    v-for="player in game.signed_players"
                    v-bind:key="player"
                    >
                    {{ player }}
                  </li>
                </ul>
              </b-card>
            </b-collapse>
          </b-list-group >
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Mafia',
  props: {
    msg: String,
  },
  data () {
   return {
     games: null,
     loading: true,
     errored: false,
     highlight: null,
     highlightLoading: true,
     notVoting: false,
     notVotingArray: null
   }
 },
 computed: {
  finishedGames: function() {
      return this.games.filter(function(game) {
        // This returns only games whose status is true i.e Complete
        return game.status
      }).sort(function(a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.game_start) - new Date(a.game_start);
      });
    },
  activeGames: function() {
      return this.games.filter(function(game) {
        // This returns only games whose status is false i.e Active
        return game.status  == false
      }).sort(function(a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.game_start) - new Date(a.game_start);
      });
    },
    voteCounts: function(){
      let voteCounts = []
      let counted = []
      this.highlight.votes.forEach((item) => {
        if(item.vote == null){
          item.vote = "Not Voting"
          this.notVoting = true
        }
        if(!counted.includes(item.voter)){
          counted.push(item.voter)
          let voted = false
          voteCounts.forEach((currentVote) =>{
            if( currentVote.target == item.vote){
                let vote = {
                  voter: item.voter,
                  postID: item.vote_post
                }
                currentVote.voted.push(vote);
                voted == true
            }
          });
          if( voted == false){
            let newTarget = {}
            newTarget.target = item.vote
            newTarget.voted = []
            let vote = {
              voter: item.voter,
              postID: item.vote_post
            }
            newTarget.voted.push(vote)
            voteCounts.push(newTarget)
          }
        }
      });
      voteCounts.forEach((item) => {
        if(item.target == "Not Voting"){
          this.notVotingArray = item.voted
        }
      });
      return voteCounts.sort(function(a,b,){
        return b.voted.length - a.voted.length
      });
    }
  },

  methods: {
    removePostID: function(url){
      return url.substring(0, url.lastIndexOf('/'));
    }
  },

  mounted () {
  axios
    .get('https://api.namafia.com/getGames')

    .then(response => {

      this.games = response.data

      // Return the highlighted game which is the highest game ID that is active.
      let highlightedGame = response.data.filter(function(game) {
        // This returns only games whose status is true i.e Complete
        return game.status == false
      }).reduce((max, game) => max.game_id > game.game_id ? max : game)

      axios
      .get('https://api.namafia.com/getDays/'+highlightedGame.game_id)
      .then(response => {
        let days  = response.data
        let recentDay = days.reduce((max, game) => max.day > game.day ? max : game);
        this.highlight = recentDay

      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.highlightLoading = false)

    })
    .catch(error => {
      console.log(error)
      this.errored = true
    })
    .finally(() => this.loading = false)
  }
}
</script>
