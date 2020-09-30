<template>
  <div class="main-wrapper">
    <h1>{{ msg }}</h1>

    <section v-if="errored">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>

    <div>
      <b-tabs content-class="mt-3">
        <b-tab title="Active Games" active>
          <div class="mafia-games">
            <div v-if="loading">Loading...</div>

            <div class="mafia-game"
              v-else
              v-for="(game, index) in activeGames"
              v-bind:key="game.game_id"
            >
              <b-button v-b-toggle="'collapse-' + index" class="m-1">{{ index + " " + game.title}}</b-button>
              <b-collapse v-if="index===0" visible :id="'collapse-'+ index">
                <b-card>
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
              <b-collapse v-else :id="'collapse-'+ index">
                <b-card>
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
            </div>
          </div>
        </b-tab>
        <b-tab title="Closed Games">
          <div class="mafia-games">
            <div v-if="loading">Loading...</div>
            <div class="mafia-game"
              v-else
              v-for="(game, index) in finishedGames"
              v-bind:key="game.game_id"
            >
              <b-button v-b-toggle="'collapse-' + index" class="m-1">{{ index + " " + game.title}}</b-button>
              <b-collapse v-if="index===0" visible :id="'collapse-'+ index">
                <b-card>
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
              <b-collapse v-else :id="'collapse-'+ index">
                <b-card>
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
            </div>
          </div>
        </b-tab>
      </b-tabs>
    </div>
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
     errored: false
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
        return game.status == false
      }).sort(function(a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.game_start) - new Date(a.game_start);
      });
    }
  },

  mounted () {
  axios
    .get('https://api.namafia.com/getGames')
    .then(response => {
      this.games = response.data

    })
    .catch(error => {
      console.log(error)
      this.errored = true
    })
    .finally(() => this.loading = false)
}

}
</script>
