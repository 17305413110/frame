<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <div class="topbar-title">
      <!-- 注意：这里就是topNavState作用之处，根据当前路由所在根路由的type值判断显示不同顶部导航菜单 -->
      <el-row v-show="$store.state.topNavState==='home'">
        <el-col :span="24">
          <el-menu
            :default-active="activeMenu"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            :router="true"
          > 
            <el-menu-item index="/home/index">评优系统</el-menu-item>
            <el-menu-item index="/user/profile">招生系统</el-menu-item>
            <!-- <el-menu-item index="/dict">过程管理</el-menu-item> -->
            <el-menu-item index="/job/log">学位授予</el-menu-item>
            <el-menu-item index="/gen/edit">博士后管理</el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip>

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import RuoYiGit from "@/components/RuoYi/Git";
import RuoYiDoc from "@/components/RuoYi/Doc";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      console.log( meta, path)
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val
        });
      }
    }
  },
  data() {
    return {
      defaultActiveIndex: '/'
    };
  },
  created() {
    // 组件创建完后获取数据
    this.fetchNavData();
  },
  watch: {
    $route: function(to, from) {
      // 路由改变时执行
      //console.info("to.path:" + to.path);
      // this.defaultActiveIndex ='/'+ this.$route.name
      this.fetchNavData();
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          location.reload();
        });
      });
    },
    fetchNavData() {
      // 初始化菜单激活项
      let cur_path = this.$route.path; //获取当前路由
      let routers = this.$router.options.routes; // 获取路由对象
      let nav_type = "",
        nav_name = "";
      for (var i = 0; i < routers.length; i++) {
        let children = routers[i].children;
        if (children) {
          for (let j = 0; j < children.length; j++) {
            if (children[j].path === cur_path) {
              nav_type = routers[i].type;
              nav_name = routers[i].name;
              break;
            }
            // 如果该菜单下还有子菜单
            if (children[j].children) {
              let grandChildren = children[j].children;
              for (let z = 0; z < grandChildren.length; z++) {
                if (grandChildren[z].path === cur_path) {
                  nav_type = routers[i].type;
                  nav_name = routers[i].name;
                  break;
                }
              }
            }
          }
        }
      }
      this.$store.state.topNavState = nav_type;
      this.$store.state.leftNavState = nav_name;
      if (nav_type == "home") {
        this.defaultActiveIndex = "/";
      } else {
        this.defaultActiveIndex = "/" + nav_name + "Manager";
      }
    },
    handleSelect(index) {
      this.defaultActiveIndex = index;
      console.log(this.defaultActiveIndex)
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .topbar-title {
    float: left;
    text-align: left;
    padding-left: 10px;
    // border-left: 1px solid #000;
  }
}
</style>
<style lang="scss">
.navbar {
  .el-menu--horizontal > .el-menu-item {
    height: 50px;
    line-height: 50px;
  }
}
</style>
