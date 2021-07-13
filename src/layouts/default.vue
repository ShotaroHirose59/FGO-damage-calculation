<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      color="grey darken-4"
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon large color="#dc5eba">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </v-list>

      <client-only>
        <div v-if="$vuetify.breakpoint.xs" class="drawer-footer mt-4 ml-4">
          <div class="drawer-footer-terms">
            <nuxt-link to="/terms">
              <p class="terms" style="font-size: 12px;">利用規約</p>
            </nuxt-link>
            <nuxt-link to="/privacy">
              <p class="terms" style="font-size: 12px;">プライバシーポリシー</p>
            </nuxt-link>
          </div>
        </div>
      </client-only>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <client-only>
        <v-app-bar-nav-icon
          v-if="!$vuetify.breakpoint.xs"
          style="color: #dc5eba"
          @click.stop="drawer = !drawer"
        />
        <v-toolbar-title v-text="title" />
        <v-spacer />
        <v-app-bar-nav-icon
          v-if="$vuetify.breakpoint.xs"
          style="color: #dc5eba"
          @click.stop="drawer = !drawer"
        />
      </client-only>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <nuxt />
      </v-container>
    </v-content>
    <client-only>
      <v-footer v-if="!$vuetify.breakpoint.xs" :fixed="fixed" app>
        <span>&copy; {{ new Date().getFullYear() }} Wオルタと計算</span>
        <v-spacer />
        <nuxt-link
          v-if="
            $route.path === '/' ||
              $route.path === '/terms' ||
              $route.path === '/privacy'
          "
          :to="{ name: 'terms' }"
        >
          <span class="terms mr-8">利用規約</span>
        </nuxt-link>
        <nuxt-link
          v-if="
            $route.path === '/' ||
              $route.path === '/terms' ||
              $route.path === '/privacy'
          "
          :to="{ name: 'privacy' }"
        >
          <span class="terms">プライバシーポリシー</span>
        </nuxt-link>
      </v-footer>
    </client-only>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'ホーム',
          to: '/'
        },
        {
          icon: 'mdi-sword-cross',
          title: '宝具ダメージ計算',
          to: '/npatk-calculation'
        },
        {
          icon: 'mdi-gauge-full',
          title: '宝具NP獲得計算',
          to: '/npaquisition-calculation'
        },
        {
          icon: 'mdi-file-document-outline',
          title: '霊基一覧',
          to: '/characters'
        },
        {
          icon: 'mdi-information-outline',
          title: 'お知らせ',
          to: '/info'
        },
        {
          icon: 'mdi-message-alert',
          title: 'フィードバック送信',
          to: '/feedback'
        },
        {
          icon: 'mdi-clipboard-text-search-outline',
          title: '1周年アンケート',
          to: '/questionnaire'
        }
      ],
      miniVariant: false,
      title: 'FGO Calculator'
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
.terms {
  color: white;
}
</style>

