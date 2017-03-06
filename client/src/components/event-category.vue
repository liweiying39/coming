<template>
  <div class="content-section">
    <cell :link="generateURL('EVENT_INTERESTED',{query: event_id: event_id })" is-link>
      <div slot="icon">
        {{ $t('event.classify.interested') }}
      </div>
      <div slot="value">
        <div class="badge-blcok">
          <div class="badge" :text="getParticipants.length.toString()">{{ getParticipants.length.toString() }}</div>
        </div>
      </div>
    </cell>
    <cell :link="generateURL('EVENT_RSVP',{query: event_id: event_id })" is-link>
      <div slot="icon">
        {{ $t('event.classify.interested') }}
      </div>
      <div slot="value">
        <div class="badge-blcok">
          <div class="badge" :text="getParticipants.length.toString()">{{ getParticipants.length.toString() }}</div>
        </div>
      </div>
    </cell>
    <cell :link="generateURL('EVENT_CHECKEDIN',{query: event_id: event_id })" is-link>
      <div slot="icon">
        {{ $t('event.classify.interested') }}
      </div>
      <div slot="value">
        <div class="badge-blcok">
          <div class="badge" :text="getParticipants.length.toString()">{{ getParticipants.length.toString() }}</div>
        </div>
      </div>
    </cell>
    <cell :link="generateURL('EVENT_MOST_TAG',{query: event_id: event_id })" is-link>
      <div slot="icon">
        {{ $t('event.classify.interested') }}
      </div>
      <div slot="value">
        <div class="badge-blcok">
          <div class="badge" :text="getParticipants.length.toString()">{{ getParticipants.length.toString() }}</div>
        </div>
      </div>
    </cell>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell'
  import generateURL from '../utils/routers'
  export default {
    components: {
      Cell
    },
    data() {
      return {

      }
    },
    props: {
      interested_num: {
        type: Number
      },
      checkedin_num: {
        type: Number
      },
      rsvp_num: {
        type:Number
      },
      most_tag_num: {
        type: Number
      }
    }
  }

</script>
