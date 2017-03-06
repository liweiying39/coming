<template>
  <h1>most tag</h1>
  <div class="content-section-container">
    <div class="content">
      <template v-for="user in getTopLikes">
        <cell :title="user.name"
              :link="jumpToProfileOrUser(user)"
              is-link>
          <div slot="after-title">
            <p class="cell-sub-title over-ellipsis">{{ user.information.job_title }}</p>
            <p class="cell-sub-title over-ellipsis">{{ user.information.organization }}</p>
          </div>
          <div slot="icon">
            <strong class="mark" v-if="user.role == 'manager'"></strong>
            <div class="participant-avatar-block">
              <img class="avatar-img" :src="user.avatar">
            </div>
          </div>

          <div slot="value">
            <div class="mar-right-10">
            <span class="like-count">
              <span class="likes-count-num">{{ user.likes }}</span> {{ $t('event.likes') }}
            </span>
            </div>
          </div>
          <div slot="child">
            <div class="mar-right-10">
            <span v-if="checkUserStatus('is_rsvp', user.status)" class="icon-label rsvp">
              {{ $t('status.rsvp') }}
            </span>
              <span v-if="checkUserStatus('is_checkin',user.status)" class="icon-label checked-in">
            {{ $t('status.checked_in') }}
            </span>
              <span v-if=" checkUserStatus('is_checkout',user.status)" class="icon-label checked-out">
            {{ $t('status.checked_out') }}
            </span>
            </div>
          </div>
        </cell>
      </template>
      <div class="mar-top-20">
        <div class="loading-btn" @click="loadMore">{{ loading_text }}</div>
        <div v-if="is_showing_loading_icon"><img src="../../static/img/loading-more.gif"></div>
      </div>
    </div>
  </div>
</template>
