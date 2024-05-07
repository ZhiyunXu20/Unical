// vite.config.js
import { fileURLToPath, URL } from "node:url";
import UnoCSS from "file:///D:/development/project/course-schedule/node_modules/.pnpm/unocss@0.58.8_postcss@8.4.38_vite@5.1.6/node_modules/unocss/dist/vite.mjs";
import Icons from "file:///D:/development/project/course-schedule/node_modules/.pnpm/unplugin-icons@0.18.5/node_modules/unplugin-icons/dist/vite.js";
import IconsResolver from "file:///D:/development/project/course-schedule/node_modules/.pnpm/unplugin-icons@0.18.5/node_modules/unplugin-icons/dist/resolver.js";
import { defineConfig } from "file:///D:/development/project/course-schedule/node_modules/.pnpm/vite@5.1.6/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/development/project/course-schedule/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.1.6_vue@3.4.21/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/development/project/course-schedule/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.1.6_vue@3.4.21/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///D:/development/project/course-schedule/node_modules/.pnpm/unplugin-auto-import@0.17.5_@vueuse+core@10.9.0/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/development/project/course-schedule/node_modules/.pnpm/unplugin-vue-components@0.26.0_vue@3.4.21/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///D:/development/project/course-schedule/node_modules/.pnpm/unplugin-vue-components@0.26.0_vue@3.4.21/node_modules/unplugin-vue-components/dist/resolvers.js";
import path from "path";
var __vite_injected_original_import_meta_url = "file:///D:/development/project/course-schedule/vite.config.js";
var pathSrc = fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url));
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    vueJsx(),
    AutoImport({
      // Auto import functions from Vue, e.g. ref, reactive, toRef...
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ["vue"],
      // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [
        ElementPlusResolver(),
        // Auto import icon components
        // 自动导入图标组件
        IconsResolver()
      ],
      dts: path.resolve(pathSrc, "auto-imports.d.ts")
    }),
    Components({
      resolvers: [
        // Auto register icon components
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ["ep"]
        }),
        // Auto register Element Plus components
        // 自动导入 Element Plus 组件
        ElementPlusResolver()
      ],
      dts: path.resolve(pathSrc, "components.d.ts")
    }),
    Icons({
      autoInstall: true
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxkZXZlbG9wbWVudFxcXFxwcm9qZWN0XFxcXGNvdXJzZS1zY2hlZHVsZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcZGV2ZWxvcG1lbnRcXFxccHJvamVjdFxcXFxjb3Vyc2Utc2NoZWR1bGVcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2RldmVsb3BtZW50L3Byb2plY3QvY291cnNlLXNjaGVkdWxlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnXHJcbmltcG9ydCBJY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJ1xyXG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tICd1bnBsdWdpbi1pY29ucy9yZXNvbHZlcidcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuXHJcbi8vIFx1ODNCN1x1NTNENlx1NUY1M1x1NTI0RFx1NkEyMVx1NTc1N1x1NzY4NFx1NzZFRVx1NUY1NVx1OERFRlx1NUY4NFxyXG5jb25zdCBwYXRoU3JjID0gZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICBVbm9DU1MoKSxcclxuICAgIHZ1ZUpzeCgpLFxyXG4gICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgIC8vIEF1dG8gaW1wb3J0IGZ1bmN0aW9ucyBmcm9tIFZ1ZSwgZS5nLiByZWYsIHJlYWN0aXZlLCB0b1JlZi4uLlxyXG4gICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgVnVlIFx1NzZGOFx1NTE3M1x1NTFGRFx1NjU3MFx1RkYwQ1x1NTk4Mlx1RkYxQXJlZiwgcmVhY3RpdmUsIHRvUmVmIFx1N0I0OVxyXG4gICAgICBpbXBvcnRzOiBbJ3Z1ZSddLFxyXG5cclxuICAgICAgLy8gQXV0byBpbXBvcnQgZnVuY3Rpb25zIGZyb20gRWxlbWVudCBQbHVzLCBlLmcuIEVsTWVzc2FnZSwgRWxNZXNzYWdlQm94Li4uICh3aXRoIHN0eWxlKVxyXG4gICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgRWxlbWVudCBQbHVzIFx1NzZGOFx1NTE3M1x1NTFGRFx1NjU3MFx1RkYwQ1x1NTk4Mlx1RkYxQUVsTWVzc2FnZSwgRWxNZXNzYWdlQm94Li4uIChcdTVFMjZcdTY4MzdcdTVGMEYpXHJcbiAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcclxuXHJcbiAgICAgICAgLy8gQXV0byBpbXBvcnQgaWNvbiBjb21wb25lbnRzXHJcbiAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU1NkZFXHU2ODA3XHU3RUM0XHU0RUY2XHJcbiAgICAgICAgSWNvbnNSZXNvbHZlcigpLFxyXG4gICAgICBdLFxyXG5cclxuICAgICAgZHRzOiBwYXRoLnJlc29sdmUocGF0aFNyYywgJ2F1dG8taW1wb3J0cy5kLnRzJyksXHJcbiAgICB9KSxcclxuXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgLy8gQXV0byByZWdpc3RlciBpY29uIGNvbXBvbmVudHNcclxuICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTZDRThcdTUxOENcdTU2RkVcdTY4MDdcdTdFQzRcdTRFRjZcclxuICAgICAgICBJY29uc1Jlc29sdmVyKHtcclxuICAgICAgICAgIGVuYWJsZWRDb2xsZWN0aW9uczogWydlcCddLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIC8vIEF1dG8gcmVnaXN0ZXIgRWxlbWVudCBQbHVzIGNvbXBvbmVudHNcclxuICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgRWxlbWVudCBQbHVzIFx1N0VDNFx1NEVGNlxyXG4gICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcclxuICAgICAgXSxcclxuXHJcbiAgICAgIGR0czogcGF0aC5yZXNvbHZlKHBhdGhTcmMsICdjb21wb25lbnRzLmQudHMnKSxcclxuICAgIH0pLFxyXG5cclxuICAgIEljb25zKHtcclxuICAgICAgYXV0b0luc3RhbGw6IHRydWUsXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRTLFNBQVMsZUFBZSxXQUFXO0FBQy9VLE9BQU8sWUFBWTtBQUNuQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7QUFDMUIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDJCQUEyQjtBQUNwQyxPQUFPLFVBQVU7QUFWMEssSUFBTSwyQ0FBMkM7QUFhNU8sSUFBTSxVQUFVLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUUvRCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxPQUFPO0FBQUEsSUFDUCxXQUFXO0FBQUE7QUFBQTtBQUFBLE1BR1QsU0FBUyxDQUFDLEtBQUs7QUFBQTtBQUFBO0FBQUEsTUFJZixXQUFXO0FBQUEsUUFDVCxvQkFBb0I7QUFBQTtBQUFBO0FBQUEsUUFJcEIsY0FBYztBQUFBLE1BQ2hCO0FBQUEsTUFFQSxLQUFLLEtBQUssUUFBUSxTQUFTLG1CQUFtQjtBQUFBLElBQ2hELENBQUM7QUFBQSxJQUVELFdBQVc7QUFBQSxNQUNULFdBQVc7QUFBQTtBQUFBO0FBQUEsUUFHVCxjQUFjO0FBQUEsVUFDWixvQkFBb0IsQ0FBQyxJQUFJO0FBQUEsUUFDM0IsQ0FBQztBQUFBO0FBQUE7QUFBQSxRQUdELG9CQUFvQjtBQUFBLE1BQ3RCO0FBQUEsTUFFQSxLQUFLLEtBQUssUUFBUSxTQUFTLGlCQUFpQjtBQUFBLElBQzlDLENBQUM7QUFBQSxJQUVELE1BQU07QUFBQSxNQUNKLGFBQWE7QUFBQSxJQUNmLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
