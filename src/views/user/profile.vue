<template>
    <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" @click-right="save"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="photo"
          @click="showPhoto=true"
        />
      </van-cell>
      <van-cell is-link title="名称" :value="user.name" @click="showName=true"/>
      <van-cell is-link title="性别" :value="user.gender===0?'男':'女'" @click="showGender=true"/>
      <van-cell is-link title="生日" :value="user.birthday" @click="showBirthday=true"/>
    </van-cell-group>
    <van-popup v-model="showPhoto" position="bottom">
      <van-cell value="从本地相册选取图片" is-link @click="openPhotoFile"/>
      <van-cell value="拍照" is-link/>
    </van-popup>
    <van-popup v-model="showName" position="bottom">
      <van-field v-model="user.name" placeholder="请输入用户名" />
    </van-popup>
    <van-popup v-model="showGender" position="bottom">
      <van-cell value="男" />
      <van-cell value="女" />
    </van-popup>
    <van-popup v-model="showBirthday" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        @cancel="showBirthday=false"
        @confirm="confirmBirthday"
        />
    </van-popup>

    <!-- 文件上传控件 -->
    <input type="file" ref="file" style="display: none" @change="upload">

  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, updatePhoto, updateProfile } from '@/api/user'
export default {
  data () {
    return {
      minDate: new Date('1990-01-01'),
      currentDate: new Date(),
      showBirthday: false,
      showGender: false,
      showName: false,
      showPhoto: false,
      photo: '',
      user: {
        name: '',
        gender: '',
        birthday: ''
      }
    }
  },
  created () {
    this.getUserProfile()
  },
  methods: {
    // 保存修改
    async save () {
      await updateProfile(this.user)
      this.$toast.success('修改成功')
    },
    // 修改头像
    async upload () {
      const file = this.$refs.file.files[0]
      const formData = new FormData()
      formData.append('photo', file)
      const data = await updatePhoto(formData)
      this.photo = data.photo
      this.showPhoto = false
    },
    // 触发日期选择控件
    openPhotoFile () {
      this.$refs.file.click()
    },
    // 日期点击确定按钮
    confirmBirthday (value) {
      this.user.birthday = dayjs(value).format('YYYY-MM-DD')
      this.showBirthday = false
    },
    // 获取用户个人资料
    async getUserProfile () {
      const data = await getUserProfile()
      this.user = data
      this.photo = data.photo
    }
  }
}
</script>

<style lang="less" scoped>
</style>
