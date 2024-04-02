<template>
  <n-modal v-model:show="show" title="编辑角色" preset="card" style="width: 500px" @ok="onSubmit">
    <n-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      label-placement="left"
      label-width="auto"
    >
      <n-form-item label="角色名称" path="roleName">
        <n-input v-model:value="formState.roleName" placeholder="请输入角色名称" />
      </n-form-item>

      <n-form-item label="权限字符" path="roleKey">
        <n-input v-model:value="formState.roleKey" placeholder="请输入权限字符" />
      </n-form-item>

      <n-form-item label="状态" path="status">
        <n-radio-group v-model:value="formState.status">
          <n-radio value="0">正常</n-radio>
          <n-radio value="1">停用</n-radio>
        </n-radio-group>
      </n-form-item>

      <n-form-item label="排序" path="orderIndex">
        <n-input-number
          v-model:value="formState.orderIndex"
          :min="0"
          :max="100"
          placeholder="请输入排序"
        />
      </n-form-item>

      <n-form-item label="权限" path="routesIdList">
        <n-tree
          block-line
          cascade
          checkable
          :selectable="false"
          default-expand-all
          :data="treeData"
          :checked-keys="formState.routesIdList"
          :key-field="treeFieldNames.value"
          :label-field="treeFieldNames.label"
          :children-field="treeFieldNames.children"
          @update:checked-keys="updateCheckedKeys"
        />
      </n-form-item>

      <div>
        <n-flex justify="end">
          <n-button @click="show = false">取消</n-button>
          <n-button type="primary" @click="onSubmit"> {{ submitText }} </n-button>
        </n-flex>
      </div>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMessage, type FormRules } from 'naive-ui'
import { getRoutesListApi } from '@/api/system/routes'
import { findByIdApi, editRoleApi } from '@/api/system/role'
import type { EditRoleParams } from '@/types/role'
import type { RoutesInfo } from '@/types/routes'

const show = ref(false)
const isMultiple = ref(false)
const currentIndex = ref(0)
const idsList = ref<string[]>([])
const submitText = ref('保存')

watch(
  () => currentIndex.value,
  () => {
    isMultiple.value = idsList.value.length - 1 === currentIndex.value
    submitText.value = isMultiple.value ? '保存' : '保存并编辑下一页'
  }
)

const formRef = ref()
const formState = ref<EditRoleParams>({
  id: '',
  roleName: '',
  roleKey: '',
  status: '0',
  orderIndex: 1,
  routesIdList: []
})
const rules: FormRules = {
  roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  roleKey: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
  orderIndex: [{ type: 'number', required: true, message: '菜单排序不能为空', trigger: 'blur' }]
}

const treeData = ref<RoutesInfo[]>([])
const treeFieldNames = { children: 'children', label: 'title', value: 'id' }

const getData = async () => {
  const queryRoutesParams = {
    all: true
  }
  const result = await getRoutesListApi(queryRoutesParams)
  if (result.code === 200) {
    treeData.value = result.data.list
  }
  const roleInfo = await findByIdApi(idsList.value[currentIndex.value])
  if (roleInfo.code === 200) {
    formState.value = roleInfo.data
  }
}

const updateCheckedKeys = (keys: string[]) => {
  formState.value.routesIdList = keys
}

const emit = defineEmits(['success'])
const message = useMessage()
const onSubmit = () => {
  formRef.value
    .validate()
    .then(async () => {
      const result = await editRoleApi(formState.value)
      if (result.code === 200) {
        message.success(result.message)
        emit('success')
        if (isMultiple.value) {
          show.value = false
        } else {
          currentIndex.value++
          getData()
        }
      } else {
        message.success(result.message)
      }
    })
    .catch((error: any) => {
      console.log('error', error)
    })
}

const formInit = () => {
  formState.value = {
    id: '',
    roleName: '',
    roleKey: '',
    status: '0',
    orderIndex: 1,
    routesIdList: []
  }
}
const showModal = (ids: string[]) => {
  show.value = true
  formInit()
  currentIndex.value = 0
  idsList.value = ids
  isMultiple.value = idsList.value.length - 1 === currentIndex.value
  submitText.value = isMultiple.value ? '保存' : '保存并编辑下一页'
  getData()
}

defineExpose({
  showModal
})
</script>

<style lang="scss" scoped>
.hint {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
</style>