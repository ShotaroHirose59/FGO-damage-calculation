<template>
  <v-row no-gutters>
    <v-card class="col-md-12">
      <v-toolbar class="title" elevation="4">
        宝具NP獲得 計算
        <v-row no-gutters>
          <v-col style="text-align: right;">
            <v-btn
              outlined
              small
              fab
              class="mr-4"
              color="purple lighten-1"
              @click="openDisplay()"
            >
              <v-icon>mdi-help</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-toolbar>
      <!-- スマホだと幅取るからいらない -->
      <client-only>
        <v-card-subtitle v-if="!$vuetify.breakpoint.xs">
          単体 or 全体宝具を持つArts Quickのサーヴァントが対象
        </v-card-subtitle>
      </client-only>

      <!-- ダイアログ (使い方、計算項目の詳細) -->
      <Dialog ref="dlg" />

      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="characterClass"
              label="クラス"
              :items="items.class"
              class="mr-4"
              color="teal"
            ></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="characterName"
              label="サーヴァント"
              :items="filteredCharacters"
              :disabled="!characterClass"
              :placeholder="placeholder"
              class="mr-4"
              color="teal"
              @input="onChangeVal(characterName)"
            ></v-select>
          </v-col>

          <v-col cols="4" sm="4" md="2">
            <v-select
              v-model="servantNpType"
              label="宝具"
              :items="selectServantNpType"
              class="mr-4"
              color="teal"
            ></v-select>
          </v-col>

          <v-col cols="4" sm="4" md="2">
            <validation-provider
              ref="provider"
              v-slot="{ errors }"
              rules="required|numeric"
            >
              <v-text-field
                v-model.number="npHits"
                label="宝具ヒット数"
                placeholder="自動"
                suffix="hit"
                :error-messages="errors"
                type="number"
                class="mr-4"
                color="teal"
              ></v-text-field>
            </validation-provider>
          </v-col>

          <v-col cols="4" sm="4" md="2">
            <validation-provider
              ref="provider"
              v-slot="{ errors }"
              rules="required"
            >
              <v-text-field
                v-model.number="npRate"
                label="NPレート"
                placeholder="自動"
                :error-messages="errors"
                type="number"
                class="mr-4"
                color="teal"
              ></v-text-field>
            </validation-provider>
          </v-col>

          <v-col cols="8" sm="4" md="2">
            <validation-provider
              ref="provider"
              v-slot="{ errors }"
              rules="required|numeric|maxCardBuff"
            >
              <v-text-field
                v-model.number="cardBuff"
                label="カード性能UP"
                suffix="％"
                :error-messages="errors"
                type="number"
                class="mr-4"
                color="teal"
              ></v-text-field>
            </validation-provider>
          </v-col>

          <v-col cols="4" sm="2" md="1">
            <PlusMinusButton
              :on-click-plus-button="
                () => {
                  if (cardBuff >= 400) {
                    return false
                  }
                  cardBuff += 10
                }
              "
              :on-click-minus-button="
                () => {
                  if (cardBuff === 0) {
                    return false
                  }
                  cardBuff -= 10
                }
              "
            />
          </v-col>

          <v-col cols="8" sm="4" md="2">
            <validation-provider
              ref="provider"
              v-slot="{ errors }"
              rules="required|numeric|maxCardBuff"
            >
              <v-text-field
                v-model.number="npAcquisitionBuff"
                label="NP獲得量UP"
                suffix="％"
                :error-messages="errors"
                type="number"
                class="mr-4"
                color="teal"
              ></v-text-field>
            </validation-provider>
          </v-col>

          <v-col cols="4" sm="2" md="1">
            <PlusMinusButton
              :on-click-plus-button="
                () => {
                  if (npAcquisitionBuff >= 400) {
                    return false
                  }
                  npAcquisitionBuff += 10
                }
              "
              :on-click-minus-button="
                () => {
                  if (npAcquisitionBuff === 0) {
                    return false
                  }
                  npAcquisitionBuff -= 10
                }
              "
            />
          </v-col>

          <v-col cols="8" sm="4" md="2">
            <validation-provider
              ref="provider"
              v-slot="{ errors }"
              rules="required|numeric"
            >
              <v-text-field
                v-model.number="overkillHits"
                label="オーバーキルヒット数"
                suffix="hit"
                :error-messages="errors"
                type="number"
                class="mr-4"
                color="teal"
              ></v-text-field>
            </validation-provider>
          </v-col>

          <v-col cols="4" sm="2" md="1">
            <PlusMinusButton
              :on-click-plus-button="
                () => {
                  if (overkillHits === npHits * 3) {
                    return false
                  }
                  overkillHits += 1
                }
              "
              :on-click-minus-button="
                () => {
                  if (overkillHits === 0) {
                    return false
                  }
                  overkillHits -= 1
                }
              "
            />
          </v-col>

          <v-col cols="8" sm="3" md="2">
            <v-select
              v-model="enemyClass"
              label="敵クラス"
              :items="items.selectEnemyClass"
              class="mr-4"
              color="teal"
            ></v-select>
          </v-col>

          <v-col cols="4" sm="3" md="1">
            <v-select
              v-model.number="enemyCount"
              label="敵の数"
              :items="items.selectEnemyCount"
              class="mr-4"
              color="teal"
            ></v-select>
          </v-col>

          <client-only>
            <v-col
              v-if="$vuetify.breakpoint.xs"
              cols="12"
              style="text-align: center;"
            >
              <v-btn color="error" class="mt-3" outlined @click="resetAll()"
                >計算リセット</v-btn
              >
            </v-col>
          </client-only>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- 結果カード スマホの場合は表示しない -->
    <client-only>
      <ResultCard
        v-if="!$vuetify.breakpoint.xs"
        :character-name="characterName"
        :servant-np-type="servantNpType"
        :card-buff="cardBuff"
        :np-rate="npRate"
        :np-hits="npHits"
        :overkill-hits="overkillHits"
        :enemy-class="enemyClass"
        :enemy-count="enemyCount"
        :np-acquisition-buff="npAcquisitionBuff"
        @reset-val="resetAll"
      />
      <!-- スマホの場合、固定フッター用意 -->
      <FixedFooter
        v-if="$vuetify.breakpoint.xs"
        :character-name="characterName"
        :servant-np-type="servantNpType"
        :card-buff="cardBuff"
        :np-rate="npRate"
        :np-hits="npHits"
        :overkill-hits="overkillHits"
        :enemy-class="enemyClass"
        :enemy-count="enemyCount"
        :np-acquisition-buff="npAcquisitionBuff"
        @reset-val="resetAll"
      />
    </client-only>
  </v-row>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import Dialog from '@/components/calculator/NpAcquisition/Dialog'
import PlusMinusButton from '@/components/calculator/PlusMinusButton'
import ResultCard from '@/components/calculator/NpAcquisition/ResultCard'
import FixedFooter from '@/components/calculator/NpAcquisition/FixedFooter'

export default {
  components: {
    ValidationProvider,
    Dialog,
    PlusMinusButton,
    ResultCard,
    FixedFooter
  },
  data() {
    return {
      characterClass: '', // 選択されたクラス
      characterName: '', // 選択されたキャラクター
      servantNpType: '', // キャラクターの宝具タイプ
      selectServantNpType: ['Arts', 'Quick', 'Buster'],
      npRate: 0, // NPレート
      npHits: 0, // 宝具ヒット回数
      overkillHits: 0,
      items: {
        class: [
          'セイバー',
          'アーチャー',
          'ランサー',
          'ライダー',
          'キャスター',
          'アサシン',
          'バーサーカー',
          'ルーラー',
          'アヴェンジャー',
          'アルターエゴ',
          'ムーンキャンサー',
          'フォーリナー'
        ],
        selectEnemyClass: [
          'セイバー (1.0)',
          'アーチャー (1.0)',
          'ランサー (1.0)',
          'ライダー (1.1)',
          'キャスター (1.2)',
          'アサシン (0.9)',
          'バーサーカー (0.8)',
          'ルーラー (1.0)',
          'アヴェンジャー (1.0)',
          'ムーンキャンサー (1.2)',
          'アルターエゴ (1.0)',
          'フォーリナー (1.0)'
        ],
        selectEnemyCount: [1, 2, 3] // 敵の数
      },
      enemyClass: 'セイバー (1.0)',
      enemyCount: 3,
      cardBuff: 0, // カード性能UP倍率
      npAcquisitionBuff: 0 // NP獲得量UP倍率
    }
  },
  computed: {
    characters() {
      return this.$store.getters['characters/artsQuickCahracters']
    },
    // クラスが選択されたら「そのクラスの値を持つキャラクターのみ」をセレクトボックスに表示
    filteredCharacters() {
      const filteredCharacters = []
      for (let i = 0; i < this.characters.length; i++) {
        const character = this.characters[i]
        if (character.class === this.characterClass) {
          filteredCharacters.push(character.name)
        }
      }
      return filteredCharacters
    },
    placeholder() {
      if (this.characterClass === '') {
        return '先にクラスを選択'
      } else {
        return 'サーヴァントを選択'
      }
    }
  },
  created() {
    this.$store.dispatch('characters/init')
  },
  methods: {
    // 選択されたキャラクターが持つ値を取得
    onChangeVal(characterName) {
      for (let i = 0; i < this.characters.length; i++) {
        const character = this.characters[i]
        if (character.name === characterName) {
          this.npRate = character.npchargeatk
          this.npHits = character.nphitcount
          this.overkillHits = 0 // オーバーキルヒット数を0に
          this.setNpType(character)
          this.setEnemyCount(character)
        }
      }
    },
    // 選択されたキャラクターの「宝具タイプ」を返す
    setNpType(character) {
      switch (character.card) {
        case 'B':
          this.servantNpType = 'Buster'
          break
        case 'A':
          this.servantNpType = 'Arts'
          break
        case 'Q':
          this.servantNpType = 'Quick'
          break
      }
      if (character.name === 'エミヤ') {
        this.servantNpType = 'Arts'
      }
    },
    // 単体宝具のキャラは敵の数を１に設定
    setEnemyCount(character) {
      if (character.npmultiplier[0] >= 900) {
        this.enemyCount = 1
      } else {
        this.enemyCount = 3
      }
    },
    openDisplay() {
      this.$refs.dlg.isDisplay = true
    },
    resetAll() {
      this.characterClass = ''
      this.characterName = ''
      this.servantNpType = ''
      this.npRate = 0
      this.npHits = 0
      this.overkillHits = 0
      this.enemyClass = 'セイバー (1.0)'
      this.enemyCount = 3
      this.cardBuff = 0
      this.npAcquisitionBuff = 0
    }
  },
  head() {
    return {
      titleTemplate: null,
      title: '【FGO】宝具NP計算 ~Wオルタと計算~',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'FGOの計算アプリです。このページでは宝具のNP獲得計算ができます。単体または全体宝具を持つArts Quickのサーヴァントが対象です。'
        }
      ]
    }
  }
}
</script>

<style>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
