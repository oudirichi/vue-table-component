<template>
  <nav v-if="shouldShowPagination">
    <ul class="pagination justify-content-center">
      <li :class="{ disabled: currentPage === 1 }">
        <a :class="{ disabled: currentPage === 1 }"
           @click="pageClicked( currentPage - 1 )">
          <i class="left chevron icon">«</i>
        </a>
      </li>

      <!-- <li v-if="hasFirst" class="page-item" :class="{ active: isActive(1) }">
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
 -->

      <template v-for="page in pages">
        <li
          v-if="page.type === 'page'"
          class="page-item"
          :class="{ active: page.active, disabled: !page.enabled }"
        >
          <a class="page-link" @click="pageClicked(page)">{{ page.text }}</a>
        </li>

        <li v-if="page.type === 'more'">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
      </template>

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

const maxPageBlocks = 9;
const ellipsisText = '\u2026';

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

    shouldShowPagination() {
      return this.totalPages > 1;
    },

  },

  methods: {
    isActive(page) {
      return page.active;
    },

    pageClicked(page) {
      if (page.type !== 'page' || !page.enabled) {
        return;
      }

      this.$emit('pageChange', page);
    },

    pageLinks() {
      const pages = [];

      pages.push(this.renderPage({ pageBlock: 1 }));

      const totalShownPages = Math.min(this.totalPages, maxPageBlocks);
      for (let pageBlock = 2; pageBlock < totalShownPages; pageBlock++) {
        pages.push(this.renderPageBlock({ pageBlock: pageBlock }));
      }

      pages.push(this.renderPage({ pageBlock: totalShownPages }));

      return pages;
    },

    renderEllipsis() {
      return {
        type: 'more',
        text: ellipsisText,
        enabled: true,
      };
    },

    renderPageBlock({ pageBlock }) {
      const hasEllipsisBlocks = this.totalPages <= maxPageBlocks;
      const renderMethod = hasEllipsisBlocks ? this.renderPageWithEllipsisBlocks : this.renderPage;

      return renderMethod.call(this, { pageBlock });
    },

    renderPage({ pageBlock }) {
      const isCurrent = pageBlock === this.currentPage;
      return {
        type: 'page',
        text: pageBlock,
        enabled: !isCurrent,
        active: isCurrent,
      };
    },

    renderPageWithEllipsisBlocks({ pageBlock }) {
      const maxPagesBetweenEllipsisBlocks = 5;

      const firstPossibleEllipsisIndex = 2;
      const lastPossibleEllipsisIndex = maxPageBlocks - 1;

      const firstEllipsisBlockShowed = this.currentPage > (((maxPagesBetweenEllipsisBlocks - 1) / 2) + 2);
      const lastEllipsisBlockShowed = this.currentPage < (this.totalPages - ((maxPagesBetweenEllipsisBlocks - 1) / 2) - 2);

      if (pageBlock === firstPossibleEllipsisIndex) {
        if (firstEllipsisBlockShowed) {
          return this.renderEllipsis();
        }

        return this.renderPage({ pageBlock });
      } else if (pageBlock === lastPossibleEllipsisIndex) {
        if (lastEllipsisBlockShowed) {
          return this.renderEllipsis();
        }

        return this.renderPage({ pageBlock });
      }

      if (firstEllipsisBlockShowed) {
        return this.renderPage({ pageBlock: pageBlock + this.currentPage - maxPagesBetweenEllipsisBlocks });
      }

      return this.renderPage({ pageBlock });
    },
  },
};
</script>
