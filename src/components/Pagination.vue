<template>
  <nav v-if="shouldShowPagination">
    <ul class="pagination justify-content-center">
      <li :class="{ disabled: currentPage === 1 }">
        <a :class="{ disabled: currentPage === 1 }"
           @click="gotoPreviousPage()">
          <i class="left chevron icon">«</i>
        </a>
      </li>

      <template v-for="page in pages">
        <li
          v-if="page.type === 'page'"
          class="page-item"
          :class="{ active: page.active, disabled: !page.enabled }"
        >
          <a class="page-link" @click="gotoPage(page)">{{ page.number }}</a>
        </li>

        <li v-if="page.type === 'more'">
          <span class="pagination-ellipsis" @click="ellipsisClick($event)">&hellip;</span>
        </li>
      </template>

      <li>
        <a :class="{ disabled: currentPage === totalPages }"
           @click="gotoNextPage()">
          <i class="right chevron icon">»</i>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>

const maxPageBlocks = 9;

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

    ellipsisClick(event) {
      this.$emit('ellipsisClick', event);
    },

    gotoNextPage() {
      this.$emit('pageChange', this.currentPage + 1);
    },

    gotoPage(page) {
      if (page.type !== 'page' || !page.enabled) {
        return;
      }

      this.$emit('pageChange', page.number);
    },

    gotoPreviousPage() {
      this.$emit('pageChange', this.currentPage - 1);
    },

    pageLinks() {
      const pages = [];

      pages.push(this.renderPage({ pageNumber: 1 }));

      const totalShownPages = Math.min(this.totalPages, maxPageBlocks);
      for (let pageBlock = 2; pageBlock < totalShownPages; pageBlock++) {
        pages.push(this.renderPageBlock({ pageBlock: pageBlock }));
      }

      pages.push(this.renderPage({ pageNumber: this.totalPages }));

      return pages;
    },

    renderEllipsis() {
      return {
        type: 'more',
        enabled: true,
      };
    },

    renderPageBlock({ pageBlock }) {
      const hasEllipsisBlocks = this.totalPages > maxPageBlocks;

      if (hasEllipsisBlocks) {
        return this.renderPageWithEllipsisBlocks({ pageBlock });
      }

      return this.renderPage({ pageNumber: pageBlock });
    },

    renderPage({ pageNumber }) {
      const isCurrent = pageNumber === this.currentPage;

      return {
        type: 'page',
        number: pageNumber,
        enabled: !isCurrent,
        active: isCurrent,
      };
    },

    renderPageWithEllipsisBlocks({ pageBlock }) {
      const maxPagesBetweenEllipsisBlocks = 5;

      const firstPossibleEllipsisIndex = 2;
      const lastPossibleEllipsisIndex = maxPageBlocks - 1;

      const middleIndexElement = Math.ceil(maxPageBlocks / 2); // eslint-disable-line no-magic-numbers
      const firstEllipsisBlockShowed = this.currentPage > middleIndexElement;
      const lastEllipsisBlockShowed = this.currentPage < (this.totalPages - middleIndexElement);

      if (pageBlock === firstPossibleEllipsisIndex) {
        if (firstEllipsisBlockShowed) {
          return this.renderEllipsis();
        }

        return this.renderPage({ pageNumber: pageBlock });
      } else if (pageBlock === lastPossibleEllipsisIndex) {
        if (lastEllipsisBlockShowed) {
          return this.renderEllipsis();
        }

        return this.renderPage({ pageNumber: this.totalPages - 1 });
      }

      if (firstEllipsisBlockShowed) {
        if (lastEllipsisBlockShowed) {
          return this.renderPage({ pageNumber: pageBlock + this.currentPage - maxPagesBetweenEllipsisBlocks });
        }

        return this.renderPage({ pageNumber: this.totalPages - maxPageBlocks + pageBlock });
      }

      return this.renderPage({ pageNumber: pageBlock });
    },
  },
};
</script>
