<template>
  <nav v-if="shouldShowPagination">
    <ul class="pagination justify-content-center">
      <li :class="{ disabled: currentPage === 1 }">
        <a :class="{ disabled: currentPage === 1 }"
           @click="pageClicked( currentPage - 1 )">
          <i class="left chevron icon">«</i>
        </a>
      </li>

      <li v-if="hasFirst" class="page-item" :class="{ active: isActive(1) }">
        <a class="page-link" @click="pageClicked(1)">1?</a>
      </li>

      <li v-if="hasFirstEllipsis"><span class="pagination-ellipsis">&hellip;</span></li>

      <li class="page-item" :class="{ active: isActive(page), disabled: page === '...' }" v-for="page in pages" :key="page">
        <a class="page-link" @click="pageClicked(page)">{{ page }}</a>
      </li>

      <li v-if="hasLastEllipsis"><span class="pagination-ellipsis">&hellip;</span></li>

      <li v-if="hasLast" class="page-item"
        :class="{ active: isActive(this.totalPages) }">
        <a class="page-link" @click="pageClicked(totalPages)">{{totalPages}}</a>
      </li>
      <li>
        <a :class="{ disabled: currentPage === totalPages }"
           @click="pageClicked( currentPage + 1 )">
          <i class="right chevron icon">»</i>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>

export default {
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    count: {
      type: Number,
      default: undefined,
    },
  },

  computed: {
    totalPages() {
      return this.count ? Math.ceil(this.count / this.perPage) : 0;
    },

    pages() {
      return this.totalPages === 0 ? [] : this.pageLinks();
    },

    hasFirst() {
      return this.currentPage >= 4 || this.totalPages < 10;
    },

    hasLast() {
      return this.currentPage <= this.totalPages - 3 || this.totalPages < 10;
    },

    hasFirstEllipsis() {
      return this.currentPage >= 4 && this.totalPages >= 10;
    },

    hasLastEllipsis() {
      return this.currentPage <= this.totalPages - 3 && this.totalPages >= 10;
    },

    shouldShowPagination() {
      return this.totalPages > 1;
    },

  },

  methods: {
    isActive(page) {
      const currentPage = this.currentPage || 1;

      return currentPage === page;
    },

    pageClicked(page) {
      if (page === '...' ||
        page === this.currentPage ||
        page > this.totalPages ||
        page < 1) {
        return;
      }

      this.$emit('pageChange', page);
    },

    pageLinks() {
      const pages = [];

      let left = 2;
      let right = this.totalPages - 1;

      if (this.totalPages >= 10) {
        left = Math.max(1, this.currentPage - 2);
        right = Math.min(this.currentPage + 2, this.totalPages);
      }

      for (let i = left; i <= right; i++) {
        pages.push(i);
      }

      return pages;
    },
  },
};
</script>
