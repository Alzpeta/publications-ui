<template lang="pug">
q-btn-dropdown(
  :text-color="dark? 'black': 'white'"
  stretch
  no-caps
  dense
  size="md"
  ripple
  padding="md md"
  unelevated
  icon="person"
  :label="currentUserInfo?.givenName"
  v-if="authenticated")
  slot(name="authenticated")
    .bg-white.account
      .row.no-wrap.q-pa-md.justify-start.q-mr-md
        .col-2.column
          slot.col-auto(name="avatar")
            q-icon.q-my-sm.text-h4.content-center.text-primary(name="face")
        .col-8.q-ml-md.column.no-wrap.justify-start
          .col-auto.text-subtitle1.text-bold.no-wrap.text-dark {{ currentUserName }}
          .col-auto.text-grey.text-caption {{ currentUserInfo.email }}
          .col-auto.q-pt-md
            .row
              q-badge.q-ma-xs(v-for="role in currentUserRoles" :key="role.id")
                span {{ role.label.split('-')[0] }}
                q-icon(name="arrow_right")
                span {{ $t(translateRoleLabel(role.label)) }}
      .row.no-wrap.q-px-md.q-pb-md.justify-center
        locale-switcher(hide-hint).col-12
      .row.no-wrap.q-pa-sm.justify-center.bg-grey-3
        q-list.full-width(color="grey")
          q-item(
            v-for="item in currentUserMenuItems"
            :key="item.id"
            clickable
            v-ripple
            @click="item.action() || null"
            :to="item.route || null")
            q-item-section(avatar)
              q-icon(:name="item.icon")
            q-item-section.text-secondary {{ $t(item.label) }}
q-btn(v-else color="warning" text-color="dark"
  :loading="authenticating" rounded icon="vpn_key" @click="doLogin")
  template(#loading)
    q-spinner-dots
    span.q-pl-sm.q-pt-xs.disabled {{ $t('action.login') }}
  slot(name="anonymous")
    span.q-pl-sm.q-pt-xs {{ $t('action.login') }}
</template>

<script>
import LocaleSwitcher from '@/components/i18n/LocaleSwitcher'
import {computed, defineComponent, ref} from 'vue'
import useAuth from "@/composables/useAuth";

export default defineComponent({
  name: 'AccountDropdown',
  props: {
    dark: {
      type: Boolean,
      default: false
    }
  },
  components: {
    LocaleSwitcher
  },
  setup() {
    const {
      hasRole,
      authenticated,
      authenticating,
      doLogin,
      doLogout,
      currentUserName,
      currentUserInfo,
      currentUserRoles
    } = useAuth()

    const adminMenuItems = ref([
      {
        id: 'admin',
        label: 'nav.admin',
        icon: 'settings',
        action: () => this.$router.push({name: 'administration'})
      }
    ])

    const menuItems = ref([
      {
        id: 'logout',
        label: 'action.logout',
        icon: 'input',
        action: doLogout
      }
    ])

    const currentUserMenuItems = computed(() => {
      if (hasRole('admin')) {
        return[
          ...adminMenuItems.value,
          ...menuItems.value
        ]
      }
      return menuItems.value
    })

    function translateRoleLabel (label) {
      // Returns i18n path for last component of role label separated by '-'
      return `label.role.${label.split('-').slice(-1)[0].trim()}`
    }

    return {
      adminMenuItems,
      menuItems,
      currentUserMenuItems,
      authenticating,
      authenticated,
      currentUserInfo,
      currentUserName,
      currentUserRoles,
      doLogin,
      doLogout,
      translateRoleLabel
    }
  }
})
</script>

<style lang="sass" scoped>
.account
  max-width: 400px
</style>
