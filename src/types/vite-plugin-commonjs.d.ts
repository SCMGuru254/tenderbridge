declare module '@originjs/vite-plugin-commonjs' {
    const viteCommonjs: () => import('vite').Plugin;
    export default viteCommonjs;
}
