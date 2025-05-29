// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><li class="part-title">Distribution av OS på nätverk</li><li class="chapter-item expanded "><a href="os_versioner.html"><strong aria-hidden="true">1.</strong> Operativsystem</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="Ubuntu_Server_GUI.html"><strong aria-hidden="true">1.1.</strong> Ubuntu Server med GUI</a></li><li class="chapter-item expanded "><a href="Ubuntu_Server_NOGUI.html"><strong aria-hidden="true">1.2.</strong> Ubuntu Server utan GUI</a></li><li class="chapter-item expanded "><a href="windows.html"><strong aria-hidden="true">1.3.</strong> Windows Server 2022 utan GUI</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">iVentoy</li><li class="chapter-item expanded "><a href="iventoy.html"><strong aria-hidden="true">2.</strong> Snabbguide</a></li><li class="chapter-item expanded "><a href="iventoy_settings.html"><strong aria-hidden="true">3.</strong> Inställningar</a></li><li class="chapter-item expanded affix "><li class="part-title">Autounattend</li><li class="chapter-item expanded "><a href="skript.html"><strong aria-hidden="true">4.</strong> Skript</a></li><li class="chapter-item expanded affix "><li class="part-title">SSH</li><li class="chapter-item expanded "><a href="ssh.html"><strong aria-hidden="true">5.</strong> Installation</a></li><li class="chapter-item expanded affix "><li class="part-title">Linux</li><li class="chapter-item expanded "><a href="omlinux.html"><strong aria-hidden="true">6.</strong> Om Linux</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="linux.html"><strong aria-hidden="true">6.1.</strong> Några (kort) kommando</a></li><li class="chapter-item expanded "><a href="filetransfer_windows_linux.html"><strong aria-hidden="true">6.2.</strong> Filöverföring</a></li><li class="chapter-item expanded "><a href="expand_disk_linux.html"><strong aria-hidden="true">6.3.</strong> Utöka utrymme</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Mjukvara</li><li class="chapter-item expanded "><a href="autojump.html"><strong aria-hidden="true">7.</strong> Autojump</a></li><li class="chapter-item expanded "><a href="gparted.html"><strong aria-hidden="true">8.</strong> Gparted</a></li><li class="chapter-item expanded "><a href="imgburn.html"><strong aria-hidden="true">9.</strong> Imgburn</a></li><li class="chapter-item expanded affix "><li class="part-title">Underhållning</li><li class="chapter-item expanded "><a href="videor.html"><strong aria-hidden="true">10.</strong> Video</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
