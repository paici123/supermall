<template>
  <div class="goods-list">
    <good-list-item v-for="item in goods" :key="item.image" :good-item="item"/>
  </div>
</template>

<script>
import GoodListItem from "./GoodsListItem";
export default {
  name: "GoodsList",
  components:{
    GoodListItem
  },
  props:{
      goods:{
          type:Array,
          default() {
              return []
          }
      }
  },
}
</script>

<style scoped>
.goods-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background-color: var(--color-background);

  padding: 2px;
}

</style>
