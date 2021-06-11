<template lang="pug">
q-page.hero.full-height.no-padding.row.overflow-hidden
  .hero-content.text-white.col-12.col-md-7.q-pa-xl
    .column.justify-between.full-height
      .title.col-auto.q-mr-xl.q-mb-xl.full-width
        h1.gt-xs.q-px-md-xl.q-mr-xl.q-pr-xl.text-bold.text-left.z-top.q-mb-none {{ $t('app.productName') }}
        h2.lt-sm.q-px-md-xl.q-mr-xl.q-pr-xl.text-bold.text-left.z-top.q-mb-none {{ $t('app.productName') }}
        .text-cesnet.text-bold.text-warning.row.justify-start.items-center.q-px-md-xl.q-mr-xl.q-gutter-sm.q-mb-lg
          q-icon.col-auto(size="2rem" name="alternate_email")
          p.col-auto.inline-block.q-pt-md CESNET
      q-space
      .cta.col-auto.q-my-lg.q-px-md-xl.q-mr-xl.z-top.full-width
        q-btn-group.full-width.text-bold(rounded)
          q-btn.full-width.shadow-3(
            color="primary"
            rounded
            icon="leaderboard"
            padding="lg"
            :to="datasetsRoute"
            :label="$t('section.datasetList')")
          q-btn.full-width.shadow-5(
            color="dark"
            rounded
            icon-right="article"
            padding="lg"
            :to="articlesRoute"
            :label="$t('section.articleList')")
  .col-0.hero-tiles.gt-xs.q-pt-xl
  .col-5.right-graphic.gt-sm
  .col-0.right-tiles.gt-sm
</template>
<script>
import {ARTICLES_COLLECTION_CODE, DATASETS_COLLECTION_CODE} from '@/constants'
import {defineComponent} from "vue";

export default defineComponent({
  name: 'Homepage',
  setup() {
    const articlesRoute = {
      name: 'community-list',
      params: {model: ARTICLES_COLLECTION_CODE, state: 'all', communityId: 'cesnet'}
    }
    const datasetsRoute = {
      name: 'community-list',
      params: {model: DATASETS_COLLECTION_CODE, state: 'all', communityId: 'cesnet'}
    }

    return {articlesRoute, datasetsRoute}
  }
})
</script>
<style lang="sass">
.hero
  height: 90vh

  .hero-content
    background: var(--q-primary-light)
    text-align: center

    h3
      line-height: 4rem

    .text-cesnet
      p
        font-size: 2rem

    .cta
      z-index: 6000 !important

  .hero-tiles::before
    content: ""
    position: absolute
    width: 550px
    height: 100%
    z-index: 1
    filter: drop-shadow(30px 10px 30px var(--q-dark))
    transform: translateX(-46%) translateY(15%)
    background: url('../assets/landing/center-tiles.png') no-repeat
    background-size: contain

  .hero-tiles
    position: relative
    background-color: transparent

  .right-graphic::before
    content: ""
    background: url('../assets/landing/right-bg.png') no-repeat
    background-size: cover
    position: absolute
    width: 100%
    height: 100%
    z-index: 0

  .right-graphic
    position: relative
    background-color: transparent

  .right-tiles::before
    content: ""
    position: absolute
    height: 100%
    width: 314px
    opacity: .8
    z-index: 1
    background: url('../assets/landing/right-tiles.png') no-repeat
    background-size: contain
    transform: translateX(-50%) translateY(-15%)

  .right-tiles
    position: relative
    background-color: transparent
</style>
