<template>
  <div class="body">
    <div class="group">
      <h3> {{ $t('dialogs.searchUser.filterBy') }} </h3>
      <div class="filter-group">
        <div class="filters">
          <TextInput @keydown="onEnterKey" v-model="fltEmail" :styles="inputStyle" :placeholder="$t('dialogs.searchUser.email')" />
          <TextInput @keydown="onEnterKey" v-model="fltFirstName" :styles="inputStyle" :placeholder="$t('dialogs.searchUser.firstName')" />
          <TextInput @keydown="onEnterKey" v-model="fltLastName" :styles="inputStyle" :placeholder="$t('dialogs.searchUser.lastName')" />
        </div>
        <div class="action">
          <IconButton :caption="$t('dialogs.searchUser.search')" @click="commitSearch" icon="fluent:search-20-regular" :styles="{colorPreset: 'accent-strong'}"/>
        </div>
      </div>
    </div>

    <div class="group loading" v-show="searching">
      <Loading/>
    </div>

    <div class="group" v-show="!searching && (result.length !== 0)">
      <h3> {{ $t('dialogs.searchUser.result') }} </h3>
      <Table
        selectable
        @select="onSelect"
        :items="result"
        :columns="[
          {key: 'firstName', label: 'dialogs.searchUser.firstName', labelI18n: true, order: 0, flex: 2},
          {key: 'lastName', label: 'dialogs.searchUser.lastName', labelI18n: true, order: 1, flex: 2},
          {key: 'email', label: 'dialogs.searchUser.email', labelI18n: true, order: 2, flex: 3},
        ]"
        :serialize="serializeResult"
        :identify="identifyResult"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type Dialog } from '~/types/Dialog';
import type { InputStyle } from '~/types/InputStyle';
import type { SearchUserResponse } from '~/types/proto/Profile';
import type { OnSelectEvent } from '~/types/Table';
import type { SimpleUser } from '~/types/User';

const props = defineProps({
  context: {type: Object as PropType<Dialog<{filter: (x: SimpleUser) => boolean}>>, required: true},
});

const { filter } = props.context.payload;
const inputStyle: InputStyle = {colorPreset: 'layer', width: "100%"};

const fltEmail = ref("");
const fltFirstName = ref("");
const fltLastName = ref("");

const validateSearch = () => {
  if (`${fltEmail.value}${fltFirstName.value}${fltLastName.value}`.trim() === ""){
    // quickError('dialogs.searchUser.notFilled', undefined, undefined, undefined, true);
    return false;
  }
  
  return true;
}

// search logics
const onEnterKey = ({ key }: KeyboardEvent) => (key === "Enter") && commitSearch();

const searching = ref(false);
const commitSearch = () => {
  if (!validateSearch()) return;
  searching.value = true;
}

// user table
const usersByProto = (prt: SearchUserResponse): SimpleUser[] => prt.users.map(u => ({
  id: u.id,
  info: u.basicInfo ?? {email: "", firstName: "", lastName: ""}
}))

const result: Ref<SimpleUser[]> = ref([
  {id: 1, info: {firstName: "1", lastName: "2", email: "3"}},
  {id: 2, info: {firstName: "4", lastName: "5", email: "6"}},
]);

const serializeResult = (u: SimpleUser) => u.info;
const identifyResult = (u: SimpleUser) => u.id;

// emits
const emitEvent = defineEmits(["emit"]);
const onSelect = (e: OnSelectEvent<SimpleUser>) => emitEvent("emit", e);

</script>

<style scoped lang="scss">
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Flex.scss";

.body {
  @include flex-col;
  @include flex-cross(stretch);
  
  padding: $space-extra;
  height: var(--height);
  gap: $space-large;
}

.group {
  @include flex-col;
  @include flex-cross(stretch);

  gap: $space-small;

  h3 {
    @include typemix-label;
    margin: 0;
  }

  &.loading {
    @include flex-cross(center);

    padding: $space-large 0;
  }
}

.filter-group {
  @include flex-row;
  @include flex-main(flex-start);
  
  gap: $space-small;
  
  .filters {
    @include flex-col;
    gap: $space-small;
    flex: 1;
  }
  
  .action {
    @include flex-col;
    @include flex-main(flex-end);
  }
}
</style>