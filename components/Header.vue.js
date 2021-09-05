const Header = {
    template: `
    <header>
        <div class="container-fluid">
            <div class="logo-container">
                <a href="/">
                    <img src="./assets/img/logo.svg" alt="">
                    <span class="lithium-button active logo-badge">
                        Tools
                    </span>
                </a>
            </div>

            <div class="header-actions">
                <div class="main-menu">
                    <ul class="d-none d-sm-block">
                        <li>
                            <a href="/">Calculator</a>
                        </li>
                        <li>
                            <a href="/history">History</a>
                        </li>
                        <li>
                            <a href="/stats">Stats</a>
                        </li>
                    </ul>
                    <img @click="toggleFloatMenu" class="d-block d-sm-none pointer" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAzNSAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUgNkgzNVYwLjVINy41TDUgNloiIGZpbGw9IiM0OEU1QzIiLz4KPHBhdGggZD0iTTMwIDIyLjVMMCAyMi41VjI4TDI3LjUgMjhMMzAgMjIuNVoiIGZpbGw9IiM0OEU1QzIiLz4KPHBhdGggZD0iTTAgMTEuNUgzNVYxNy41SDBWMTEuNVoiIGZpbGw9IiM0OEU1QzIiLz4KPC9zdmc+Cg==">
                </div>
            </div>
        </div>

        <div id="floating-menu" v-if="showFloatMenu">
            <div class="close-btn" @click="toggleFloatMenu">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjU4NiA3Ljc3ODE1TDEuMzQzMzQgMTIuMDIwOEwwLjYzNjIzIDE1LjU1NjNMNy4wMDAyMiA5LjE5MjM2TDEzLjM2NDIgMTUuNTU2M0wxMi42NTcxIDEyLjAyMDhMOC40MTQ0MyA3Ljc3ODE1TDEyLjY1NyAzLjUzNTUzTDEzLjM2NDIgMEw3LjAwMDIyIDYuMzYzOTRMMC42MzYyNzggMEwxLjM0MzM5IDMuNTM1NTNMNS41ODYgNy43NzgxNVoiIGZpbGw9IiMxREU5QzAiLz4KPC9zdmc+Cg==" alt="close">
            </div>
            <ul>
                <li>
                    <a href="/">Calculator</a>
                </li>
                <li>
                    <a href="/history">History</a>
                </li>
                <li>
                    <a href="/stats">Stats</a>
                </li>
            </ul>
        </div>
    </header>
    `,
    data() {
        return {
            showFloatMenu: false
        }
    },
    methods: {
        toggleFloatMenu() {
            this.showFloatMenu = !this.showFloatMenu
        }
    }
}