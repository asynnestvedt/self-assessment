const style =
    /* css */`
    header {
        display: inline-block;
        position: fixed;
        -webkit-box-shadow: 0 0 70px #fff;
        -moz-box-shadow: 0 0 70px #fff;
        box-shadow: 0 0 70px #fff;
        width: 80%;
        top: 0px;
        left: 10%;
        z-index: 1000;
    }

    ul {
        padding-inline-start: 0;
    }

    .decor {
        background: #6EAF8D;
        background: -webkit-linear-gradient(left, #CDEBDB 50%, #6EAF8D 50%);
        background: -moz-linear-gradient(left, #CDEBDB 50%, #6EAF8D 50%);
        background: -o-linear-gradient(left, #CDEBDB 50%, #6EAF8D 50%);
        background: linear-gradient(left, white 50%, #6EAF8D 50%);
        background-size: 50px 25%;
        ;
        padding: 2px;
        display: block;
    }

    nav a {
        text-decoration: none;
        color: #fff;
        display: block;
    }

    nav ul {
        list-style: none;
        position: relative;
        text-align: left;
    }

    nav li {
        float: left;
    }

    /* clear'n floats */
    nav ul:after {
        clear: both;
    }

    nav ul:before,
    nav ul:after {
        content: " ";
        display: table;
    }

    nav {
        background: #2B2B2B;
        background-image: -webkit-linear-gradient(bottom, #2B2B2B 7%, #333333 100%);
        background-image: -moz-linear-gradient(bottom, #2B2B2B 7%, #333333 100%);
        background-image: -o-linear-gradient(bottom, #2B2B2B 7%, #333333 100%);
        background-image: linear-gradient(bottom, #2B2B2B 7%, #333333 100%);
        text-align: center;
        letter-spacing: 1px;
        text-shadow: 1px 1px 1px #0E0E0E;
        -webkit-box-shadow: 2px 2px 3px #888;
        -moz-box-shadow: 2px 2px 3px #888;
        box-shadow: 2px 2px 3px #888;
        border-bottom-right-radius: 8px;
        border-bottom-left-radius: 8px;
        display: flex;
        justify-content: center;
    }

    /* prime */
    nav ul.primary {
        margin: 0;
    }

    nav ul.primary li a {
        display: block;
        padding: 20px 30px;
        border-right: 1px solid #3D3D3D;
    }

    nav ul.primary li:last-child a {
        border-right: none;
    }

    nav ul.primary li a:hover {
        color: #000;
    }

    /* subs */
    nav ul.sub {
        position: absolute;
        z-index: 200;
        box-shadow: 2px 2px 0 #BEBEBE;
        width: 35%;
        display: none;
    }

    nav ul.sub li {
        float: none;
        margin: 0;
    }

    nav ul.sub li a {
        border-bottom: 1px dotted #ccc;
        border-right: none;
        color: #000;
        padding: 15px 30px;
    }

    nav ul.sub li:last-child a {
        border-bottom: none;
    }

    nav ul.sub li a:hover {
        color: #000;
        background: #eeeeee;
    }

    /* sub display*/
    nav ul.primary li:hover ul {
        display: block;
        background: #fff;
    }

    /* keeps the tab background white */
    nav ul.primary li:hover a {
        background: #fff;
        color: #666;
        text-shadow: none;
    }

    nav ul.primary li:hover>a {
        color: #000;
    }

    @media only screen and (max-width: 600px) {
        .decor {
            padding: 3px;
        }

        .wrap {
            width: 100%;
            margin-top: 0px;
        }

        li {
            float: none;
        }

        ul.primary li:hover a {
            background: none;
            color: #8B8B8B;
            text-shadow: 1px 1px #000;
        }

        ul.primary li:hover ul {
            display: block;
            background: #272727;
            color: #fff;
        }

        ul.sub {
            display: block;
            position: static;
            box-shadow: none;
            width: 100%;
        }

        ul.sub li a {
            background: #272727;
            border: none;
            color: #8B8B8B;
        }

        ul.sub li a:hover {
            color: #ccc;
            background: none;
        }
    }
    `

const newstyle = document.createElement('style')
newstyle.id = 'style_MyNav'
newstyle.innerHTML = style

class MyNav extends HTMLElement {
    constructor() {
        super()
        const content = document.createElement('div')
        content.innerHTML = MyNav.template()
        const shadow = this.attachShadow({mode: 'open'})
        shadow.appendChild(newstyle)
        shadow.appendChild(content)
    }

    static template() {
        return /* html */`
        <header>
        <span class="decor"></span>
        <nav>
            <ul class="primary">
            <li><a href="#assessment">Assessment</a></li>
            <li><a href="#page-history">History</a></li>
            <!--<li><a href="#page-role-targets">Role Targets</a></li>-->
            <li><a>About</a>
                <ul class="sub">
                    <li>
                        <a target="__blank" href="https://github.com/asynnestvedt">
                            <img width="50" src="./assets/github-mark.png" alt="github logo" /><br>
                            Made by Alan Synnestvedt
                        </a>
                    </li>
                </ul>
            </li>
            </ul>
        </nav>
    </header>`
    }
}

customElements.define('my-nav', MyNav)