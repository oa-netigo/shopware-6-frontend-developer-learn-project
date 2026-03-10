/* ============================================================
   APP DATA — All course content, quiz questions, exam questions, flashcards
   ============================================================ */

window.APP_DATA = {

  /* ==========================================================
     MODULES
     ========================================================== */
  modules: [

    /* --------------------------------------------------------
       MODULE 1 — Shopware Storefront Templating
       -------------------------------------------------------- */
    {
      id: 'module-1',
      title: 'Shopware Storefront Templating',
      icon: '📄',
      color: '#189eff',
      description: 'Learn how Shopware uses Twig for server-side templating: extending blocks, using sw_extends/sw_include, and key Twig features like filters and functions.',
      sections: [
        {
          id: 'section-1-1',
          title: 'Getting Started with Twig',
          content: `
<p><strong>Twig</strong> is a server-side PHP templating engine used in Shopware (and Symfony). PHP processes all Twig code before sending HTML to the browser — the client never sees Twig syntax, only clean HTML, CSS, and JavaScript.</p>

<h3>Creating a Plugin</h3>
<p>Use the Shopware console command to generate a plugin skeleton:</p>
<pre><code class="language-bash">bin/console plugin:create AcademyFrontendEssentials Academy</code></pre>
<p>This creates the plugin in <code>custom/plugins/</code>. The second argument is the PHP namespace.</p>

<h3>Install &amp; Activate</h3>
<p>Before installing, Shopware needs to detect the new plugin:</p>
<pre><code class="language-bash"># 1. Refresh the plugin list (required before install)
bin/console plugin:refresh

# 2. Install and activate
bin/console plugin:install AcademyFrontendEssentials --activate

# Or in one step:
bin/console plugin:install AcademyFrontendEssentials --activate</code></pre>

<h3>Development Mode</h3>
<p>Set <code>APP_ENV=dev</code> in your <code>.env</code> file, then clear the cache:</p>
<pre><code class="language-bash">bin/console cache:clear</code></pre>

<h3>Adding a Template — Mirroring the File Structure</h3>
<p>To override any Shopware core template, mirror its path inside your plugin's <code>src/Resources/views/</code> directory:</p>
<pre><code class="language-bash"># Core path:
vendor/shopware/storefront/Resources/views/storefront/page/product-detail/index.html.twig

# Your plugin path:
custom/plugins/AcademyFrontendEssentials/src/Resources/views/storefront/page/product-detail/index.html.twig</code></pre>

<h3>Verification Test — Hello World</h3>
<p>Create <code>src/Resources/views/storefront/base.html.twig</code> to verify your plugin works:</p>
<pre><code class="language-twig">{% sw_extends '@Storefront/storefront/base.html.twig' %}

{% block base_body %}
    &lt;h1&gt;Hello World&lt;/h1&gt;
{% endblock %}</code></pre>
<p>If you see "Hello World" on your storefront, the plugin is working correctly.</p>

<h3>Troubleshooting Checklist</h3>
<ul>
  <li>Plugin is not installed and activated → run <code>plugin:install --activate</code></li>
  <li>Template is not in the right directory → mirror the exact core path</li>
  <li>File is named incorrectly → correct is <code>base.html.twig</code>, not <code>base.twig.html</code></li>
  <li>Cache not cleared → run <code>bin/console cache:clear</code></li>
</ul>
          `
        },
        {
          id: 'section-1-2',
          title: 'Twig Blocks',
          content: `
<p>Twig <strong>blocks</strong> are named sections of a template that can be overridden or extended by child templates. Finding and overriding the right block is the core skill of Shopware frontend development.</p>

<h3>Finding the Right Block</h3>
<ul>
  <li><strong>Browser DevTools</strong>: Inspect the HTML element, note its CSS class or ID, then search for it in the template files.</li>
  <li><strong>FroshDeveloperHelper</strong>: A plugin that dumps HTML comments into the page source showing block names. Install via: <code>composer require frosh/development-helper</code></li>
  <li><strong>Custom class names</strong>: Add your own unique class names in your templates to easily identify your overrides.</li>
</ul>

<h3>sw_extends — Extending a Template</h3>
<p>Use <code>sw_extends</code> (Shopware's version of Twig's <code>extends</code>) to inherit from a template and override specific blocks:</p>
<pre><code class="language-twig">{% sw_extends '@Storefront/storefront/element/cms-element-product-name.html.twig' %}

{% block element_product_name_inner %}
  &lt;h2&gt;Is an awesome product! 🎉&lt;/h2&gt;
{% endblock %}</code></pre>
<p>This completely replaces the block content. To keep the original content, use <code>parent()</code>:</p>
<pre><code class="language-twig">{% sw_extends '@Storefront/storefront/element/cms-element-product-name.html.twig' %}

{% block element_product_name_inner %}
  {{ parent() }}
  &lt;h2&gt;Is an awesome product! 🎉&lt;/h2&gt;
{% endblock %}</code></pre>

<h3>sw_include — Including Partial Templates</h3>
<p><code>sw_include</code> embeds a partial template into the current one — like a reusable component:</p>
<pre><code class="language-twig">{% sw_include '@Storefront/storefront/page/product-detail/frontend-essentials/color.html.twig' %}</code></pre>

<p>Pass variables with the <code>with</code> keyword:</p>
<pre><code class="language-twig">{% sw_include '@Storefront/storefront/frontend-essentials/custom-block.html.twig' with {
    custom_variable: "Greetings."
} %}</code></pre>

<p>Suppress errors for optional templates with <code>ignore missing</code>:</p>
<pre><code class="language-twig">{% sw_include '@Storefront/storefront/frontend-essentials/custom-block.html.twig' ignore missing %}</code></pre>

<h3>Template Inheritance Order</h3>
<p>When multiple plugins override the same block, the load order is controlled by the <code>views</code> array in <code>theme.json</code>. <strong>The last entry has the highest priority:</strong></p>
<pre><code class="language-json">{
  "views": [
    "@Storefront",
    "@Plugins",
    "@MyTheme"
  ]
}</code></pre>
<p>Here <code>@MyTheme</code> overrides everything above it.</p>
          `
        },
        {
          id: 'section-1-3',
          title: 'Twig Features: Tags, Filters & Functions',
          content: `
<h3>Tags</h3>
<p>Twig tags are wrapped in <code>{% %}</code> delimiters.</p>

<p><strong>set</strong> — define a local variable:</p>
<pre><code class="language-twig">{% set variable_name = 'Value' %}</code></pre>

<p><strong>if / else / endif</strong> — conditional rendering. Use <code>is same as</code> for strict comparison:</p>
<pre><code class="language-twig">{% set welcoming = "Hi there." %}
{% if welcoming is same as("Greetings.") %}
    {% sw_include '@Storefront/.../custom-block.html.twig' with { custom_variable: welcoming } %}
{% else %}
    {% sw_include '@Storefront/.../custom-block.html.twig' %}
{% endif %}</code></pre>

<p><strong>for / endfor</strong> — loop over a collection:</p>
<pre><code class="language-twig">{% set products = ['Shirt', 'Shoes', 'Hat'] %}
&lt;ul&gt;
  {% for product in products %}
    &lt;li&gt;{{ loop.index }}. {{ product }}&lt;/li&gt;
  {% endfor %}
&lt;/ul&gt;</code></pre>
<p>Loop variables: <code>loop.index</code> (1-based counter), <code>loop.length</code> (total items).</p>

<h3>Filters</h3>
<p>Filters transform variable output using the <code>|</code> syntax.</p>

<p><strong>default</strong> — fallback value if variable is undefined or empty:</p>
<pre><code class="language-twig">{{ custom_variable|default('Hello World') }}</code></pre>

<p><strong>currency</strong> — Shopware-specific filter; formats as price using the active sales channel's currency and locale:</p>
<pre><code class="language-twig">{{ product.price|currency }}
{{-- Renders: 12,99€ (de-DE) or €12.99 (en-GB) --}}</code></pre>

<p><strong>sw_sanitize</strong> — strips dangerous HTML tags (script, event handlers) while keeping safe tags. Prevents XSS:</p>
<pre><code class="language-twig">{% set input_html = '&lt;p&gt;Hello &lt;b&gt;World&lt;/b&gt; &lt;script&gt;alert("XSS")&lt;/script&gt;&lt;/p&gt;' %}
{{ input_html|sw_sanitize }}
{# Output: &lt;p&gt;Hello &lt;b&gt;World&lt;/b&gt;&lt;/p&gt; #}</code></pre>

<h3>Functions</h3>
<p>Functions are called with <code>()</code> syntax.</p>

<p><strong>parent()</strong> — inside a block, renders the parent template's original block content.</p>

<p><strong>config()</strong> — Shopware-specific; reads a system configuration value:</p>
<pre><code class="language-twig">{{ config('AcademyFrontendEssentials.config.showColorfulTab') }}</code></pre>

<p><strong>dump()</strong> — debugging tool (dev environment only); outputs all or specific template variables:</p>
<pre><code class="language-twig">{{ dump() }}        {# all variables #}
{{ dump(product) }} {# specific variable #}</code></pre>

<div class="alert alert-info">
  <strong>Note:</strong> Shopware uses <code>sw_extends</code> and <code>sw_include</code> instead of native Twig <code>extends</code> and <code>include</code> to ensure proper plugin/theme inheritance order.
</div>
          `
        }
      ],

      /* Module 1 Quiz */
      quiz: [
        {
          id: 'q-m1-01',
          question: 'What command creates a new Shopware plugin with the namespace "Academy"?',
          options: [
            'bin/console make:plugin AcademyFrontendEssentials',
            'bin/console plugin:create AcademyFrontendEssentials Academy',
            'bin/console plugin:generate AcademyFrontendEssentials',
            'bin/console create:plugin AcademyFrontendEssentials Academy'
          ],
          correct: 1,
          explanation: '`plugin:create` is the correct command. The first argument is the plugin name, the second is the PHP namespace.'
        },
        {
          id: 'q-m1-02',
          question: 'After creating a new plugin, what command must you run BEFORE `plugin:install`?',
          options: [
            'bin/console cache:clear',
            'bin/console theme:compile',
            'bin/console plugin:refresh',
            'bin/console plugin:activate'
          ],
          correct: 2,
          explanation: '`plugin:refresh` scans the `custom/plugins/` directory so Shopware becomes aware of newly created plugins before they can be installed.'
        },
        {
          id: 'q-m1-03',
          question: 'Where must you place your plugin\'s Twig templates to override Shopware core templates?',
          options: [
            'src/Resources/templates/storefront/',
            'src/Resources/views/storefront/',
            'src/Resources/twig/storefront/',
            'src/views/storefront/'
          ],
          correct: 1,
          explanation: 'Templates go in `src/Resources/views/storefront/` and must mirror the exact file path of the core template being overridden.'
        },
        {
          id: 'q-m1-04',
          question: 'What does `sw_extends` do in a Shopware Twig template?',
          options: [
            'It imports a PHP class into the template',
            'It extends a Twig template following Shopware\'s plugin inheritance order',
            'It includes a partial template that can receive variables',
            'It registers a new Twig block in the global registry'
          ],
          correct: 1,
          explanation: '`sw_extends` is Shopware\'s wrapper around Twig\'s `extends`, ensuring correct plugin/theme override priority order is respected.'
        },
        {
          id: 'q-m1-05',
          question: 'Which function call preserves the original block content while adding new content around it?',
          options: [
            '{{ original() }}',
            '{{ inherit() }}',
            '{{ parent() }}',
            '{{ super() }}'
          ],
          correct: 2,
          explanation: '`parent()` outputs the parent template\'s block content, allowing you to extend rather than fully replace it.'
        },
        {
          id: 'q-m1-06',
          question: 'What is the purpose of `sw_include` compared to `sw_extends`?',
          options: [
            '`sw_include` overrides a full template; `sw_extends` adds partial content',
            '`sw_include` embeds a partial template into the current one; `sw_extends` inherits a full template',
            'They are identical — both extend templates',
            '`sw_include` is for JavaScript files; `sw_extends` is for Twig files'
          ],
          correct: 1,
          explanation: '`sw_include` pulls in a partial template fragment (like a component), while `sw_extends` creates full template inheritance.'
        },
        {
          id: 'q-m1-07',
          question: 'In the `theme.json` `views` array, which entry has the highest template override priority?',
          options: [
            'The first entry',
            'The entry named @Storefront',
            'The last entry',
            'All entries have equal priority'
          ],
          correct: 2,
          explanation: 'In both the `views` and `style` arrays of `theme.json`, the last listed entry has the highest priority.'
        },
        {
          id: 'q-m1-08',
          question: 'What does the `|sw_sanitize` filter do?',
          options: [
            'It formats a number as a price with currency symbol',
            'It removes whitespace from a string',
            'It strips potentially dangerous HTML tags and attributes to prevent XSS',
            'It encodes special HTML characters as entities'
          ],
          correct: 2,
          explanation: '`sw_sanitize` is a Shopware-specific filter that removes script tags, event handlers, and other XSS vectors while keeping safe HTML tags.'
        },
        {
          id: 'q-m1-09',
          question: 'How do you use the Shopware `config()` Twig function to read a plugin setting?',
          options: [
            '{{ shopware.config(\'fieldName\') }}',
            '{{ getConfig(\'Plugin.config.field\') }}',
            '{{ config(\'PluginName.config.fieldName\') }}',
            '{{ system_config(\'Plugin.field\') }}'
          ],
          correct: 2,
          explanation: 'The `config()` function takes the full dot-notation path: `PluginName.config.fieldName`.'
        },
        {
          id: 'q-m1-10',
          question: 'You overrode a Twig block but your changes are not appearing. Which is NOT a common cause?',
          options: [
            'The plugin is not activated',
            'The template file is in the wrong directory',
            'The PHP version is outdated',
            'The Shopware cache has not been cleared'
          ],
          correct: 2,
          explanation: 'PHP version incompatibility causes installation failures, not silent template override failures. Plugin activation, correct path, and cleared cache are the classic issues.'
        }
      ],

      /* Module 1 Flashcards */
      flashcards: [
        { id: 'fc-m1-01', front: 'What is Twig?', back: 'A server-side PHP templating engine. PHP processes Twig before sending HTML to the browser — the client never sees Twig syntax, only clean HTML.' },
        { id: 'fc-m1-02', front: 'Command to create a new plugin', back: '`bin/console plugin:create PluginName Namespace` — creates skeleton in `custom/plugins/`. Second arg is the PHP namespace.' },
        { id: 'fc-m1-03', front: 'Why run `plugin:refresh` before install?', back: 'Shopware must scan `custom/plugins/` to detect newly created plugins before they can be installed.' },
        { id: 'fc-m1-04', front: 'How to install and activate a plugin in one step', back: '`bin/console plugin:install PluginName --activate`' },
        { id: 'fc-m1-05', front: 'How to enable development mode', back: 'Set `APP_ENV=dev` in `.env`, then run `bin/console cache:clear`' },
        { id: 'fc-m1-06', front: 'Template file location rule', back: 'Mirror the core template path under `src/Resources/views/storefront/`. When paths match, your file overrides the core.' },
        { id: 'fc-m1-07', front: 'What is `base.html.twig`?', back: 'The root Twig template for all Shopware storefront pages. All other templates inherit from it.' },
        { id: 'fc-m1-08', front: '`sw_extends` vs native `extends`', back: '`sw_extends` is Shopware\'s wrapper that follows plugin/theme inheritance order. Always use `sw_extends` in Shopware storefront templates.' },
        { id: 'fc-m1-09', front: '`parent()` function', back: 'Called inside a block override to output the parent template\'s original block content. Allows extending rather than fully replacing a block.' },
        { id: 'fc-m1-10', front: '`sw_include` purpose', back: 'Embeds a partial Twig template into the current template — like a reusable component. Use `with {}` to pass variables.' },
        { id: 'fc-m1-11', front: '`ignore missing` keyword', back: 'Added to `sw_include` to suppress errors when the included file does not exist: `{% sw_include \'file.twig\' ignore missing %}`' },
        { id: 'fc-m1-12', front: 'Template inheritance order in theme.json', back: 'Defined in the `views` array. Last entry has highest priority and overrides all earlier entries.' },
        { id: 'fc-m1-13', front: '`|sw_sanitize` filter', back: 'Strips dangerous HTML (script tags, event handlers) while preserving safe tags like `<p>`, `<b>`, `<a>`. Prevents XSS attacks.' },
        { id: 'fc-m1-14', front: '`config()` Twig function', back: 'Reads a Shopware system config value. Usage: `{{ config(\'PluginName.config.fieldName\') }}`' },
        { id: 'fc-m1-15', front: 'Twig strict comparison operator', back: '`is same as` — checks both value AND type equality. Example: `{% if value is same as("Greetings.") %}`' }
      ]
    },

    /* --------------------------------------------------------
       MODULE 2 — SCSS and Storefront JavaScript
       -------------------------------------------------------- */
    {
      id: 'module-2',
      title: 'SCSS and Storefront JavaScript',
      icon: '🎨',
      color: '#9b59b6',
      description: 'Master the 7-1 SCSS pattern for organized styling and Bootstrap integration, then learn the Shopware JavaScript plugin system to add dynamic behavior.',
      sections: [
        {
          id: 'section-2-1',
          title: 'Custom SCSS & the 7-1 Pattern',
          content: `
<p>SCSS is a CSS preprocessor that lets you write more organized, maintainable styles. Shopware recommends the <strong>7-1 pattern</strong> for structuring SCSS files.</p>

<h3>The 7-1 Pattern</h3>
<p>Seven folders and one main entry file (<code>base.scss</code>):</p>
<pre><code class="language-bash">src/Resources/app/storefront/src/scss/
├── base.scss           # Entry point — imports everything
├── base/               # Typography, resets
├── components/         # UI components (buttons, sliders)
├── layout/             # Header, footer, navigation, grid
├── pages/              # Page-specific styles
├── themes/             # Dark mode, brand variants
├── utils/              # Variables and mixins (shared helpers)
└── vendors/            # Third-party SCSS libraries</code></pre>

<div class="alert alert-info">
  <strong>Important:</strong> Shopware does NOT generate these folders automatically. You create them yourself as needed.
</div>

<h3>utils/_variables.scss</h3>
<p>Define global values used across all SCSS files:</p>
<pre><code class="language-scss">$shop-primary-color: #0d6efd;
$shop-secondary-color: #6c757d;
$spacer: 1rem;</code></pre>

<h3>utils/_mixins.scss</h3>
<p>Define reusable functions with <code>@mixin</code> / <code>@include</code>:</p>
<pre><code class="language-scss">@mixin respond-to($breakpoint) {
  @if $breakpoint == sm {
    @media (max-width: 576px) { @content; }
  }
  @if $breakpoint == md {
    @media (max-width: 768px) { @content; }
  }
}

// Usage:
.my-container {
  @include respond-to(md) {
    padding: $spacer;
  }
}</code></pre>

<h3>base.scss — The Entry File</h3>
<pre><code class="language-scss">/* Utils */
@import "utils/variables";
@import "utils/mixins";

/* Layout */
@import "layout/main-navigation";
@import "layout/header";
@import "layout/footer";

/* Components */
@import "components/buy-widget";

/* Pages */
@import "pages/product-detail";</code></pre>

<div class="alert alert-warning">
  <strong>@import vs @use:</strong> Shopware uses <code>scssphp</code> (a PHP-based SCSS compiler), not Dart Sass. Always use <code>@import</code> in Shopware projects — <code>@use</code> is not supported here.
</div>

<h3>Bootstrap in Shopware</h3>
<p>Bootstrap is already included in Shopware — no separate installation needed. Use classes directly in templates:</p>
<pre><code class="language-twig">&lt;!-- Grid --&gt;
&lt;div class="row"&gt;
  &lt;div class="col-md-4"&gt;Column 1&lt;/div&gt;
  &lt;div class="col-md-4"&gt;Column 2&lt;/div&gt;
  &lt;div class="col-md-4"&gt;Column 3&lt;/div&gt;
&lt;/div&gt;

&lt;!-- Buttons --&gt;
&lt;a href="#" class="btn btn-primary"&gt;Primary&lt;/a&gt;
&lt;a href="#" class="btn btn-secondary"&gt;Secondary&lt;/a&gt;

&lt;!-- Utilities --&gt;
&lt;div class="text-center m-2 p-2"&gt;Centered text&lt;/div&gt;</code></pre>

<h3>Compiling & Watching</h3>
<pre><code class="language-bash"># Compile SCSS to production CSS
bin/console theme:compile

# Watch mode: auto-recompile on file changes (port 9998, with source maps)
bin/watch-storefront.sh</code></pre>
          `
        },
        {
          id: 'section-2-2',
          title: 'Custom Storefront JavaScript',
          content: `
<p>Shopware has a custom JavaScript plugin system for the storefront. It provides a structured, maintainable way to add or override interactive behavior.</p>

<h3>Storefront vs. Administration JavaScript</h3>
<p><strong>Storefront JS</strong> controls what the customer sees and interacts with. <strong>Administration JS</strong> extends the Shopware backend. This course covers storefront JS only.</p>

<div class="alert alert-info">
  <strong>jQuery removed:</strong> Since Shopware 6.5, jQuery is no longer part of the storefront core. Use vanilla JavaScript or ES6+ features.
</div>

<h3>The PluginManager</h3>
<p><code>window.PluginManager</code> is Shopware's global plugin registry. Use it to register new plugins or override existing ones.</p>

<h3>File Structure</h3>
<pre><code class="language-bash">src/Resources/app/storefront/src/
├── main.js                          # Entry point
└── example-plugin/
    └── example-plugin.plugin.js    # The plugin class</code></pre>

<h3>main.js — The Entry Point</h3>
<pre><code class="language-javascript">import ExamplePlugin from './example-plugin/example-plugin.plugin';

const PluginManager = window.PluginManager;

// Register: name, class, CSS selector
PluginManager.register('ExamplePlugin', ExamplePlugin, '[data-example-plugin]');</code></pre>

<h3>example-plugin.plugin.js — A Custom Plugin</h3>
<pre><code class="language-javascript">import Plugin from 'src/plugin-system/plugin.class';

export default class ExamplePlugin extends Plugin {
    init() {
        // init() is called when the plugin attaches to its DOM element
        console.log('Plugin initialized!');
        window.addEventListener('scroll', this.onScroll.bind(this));
    }

    onScroll() {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
            alert('End of page reached!');
        }
    }
}</code></pre>

<h3>Linking Plugin to Template</h3>
<p>Add the <code>data-*</code> attribute to an HTML element in a Twig template. The <code>&lt;template&gt;</code> element is ideal — it renders no visible content:</p>
<pre><code class="language-twig">{% sw_extends '@Storefront/storefront/page/content/index.html.twig' %}

{% block base_main_inner %}
    {{ parent() }}
    &lt;template data-example-plugin&gt;&lt;/template&gt;
{% endblock %}</code></pre>

<h3>Build Commands</h3>
<pre><code class="language-bash"># Compile JS to dist/ folder (Shopware loads from dist/)
bin/build-storefront.sh

# Watch: auto-recompile on save (does NOT update dist/)
bin/watch-storefront.sh</code></pre>

<h3>Overriding an Existing Plugin</h3>
<p>To override (e.g.) the AddToCartPlugin to prevent the offcanvas cart from opening:</p>
<pre><code class="language-javascript">// custom-add-to-cart.plugin.js
import AddToCartPlugin from 'src/plugin/add-to-cart/add-to-cart.plugin';

export default class CustomAddToCartPlugin extends AddToCartPlugin {
    _openOffCanvasCart() {
        // Override: do nothing (or call super._openOffCanvasCart() to extend)
        console.log('Item added without opening offcanvas cart');
    }
}</code></pre>
<pre><code class="language-javascript">// main.js
import CustomAddToCartPlugin from './custom-add-to-cart/custom-add-to-cart.plugin';

const PluginManager = window.PluginManager;
PluginManager.override('AddToCart', CustomAddToCartPlugin, '[data-add-to-cart]');</code></pre>

<h3>Async Plugins</h3>
<p>Some Shopware plugins are loaded asynchronously (lazy-loaded) for performance. If you override an async plugin, your override must also use dynamic import:</p>
<pre><code class="language-javascript">PluginManager.override(
  'AddToCart',
  () => import('./custom-add-to-cart/custom-add-to-cart.plugin'),
  '[data-add-to-cart]'
);</code></pre>
<p>Async plugins are typically used for page-specific features (product detail, checkout, etc.) to keep the initial JS payload small.</p>
          `
        }
      ],

      /* Module 2 Quiz */
      quiz: [
        {
          id: 'q-m2-01',
          question: 'What is the main entry point SCSS file in a Shopware plugin or theme?',
          options: ['styles.scss', 'main.scss', 'base.scss', 'index.scss'],
          correct: 2,
          explanation: '`base.scss` is the SCSS entry file in Shopware (analogous to `main.js` for JavaScript). It imports all other partial SCSS files.'
        },
        {
          id: 'q-m2-02',
          question: 'In the 7-1 SCSS pattern, where should global color and spacing variables be defined?',
          options: ['base/_variables.scss', 'components/_variables.scss', 'utils/_variables.scss', 'themes/_variables.scss'],
          correct: 2,
          explanation: 'The `utils/` folder contains helper files like `_variables.scss` and `_mixins.scss` that are shared across all other SCSS files.'
        },
        {
          id: 'q-m2-03',
          question: 'Why does Shopware use `@import` instead of `@use` in SCSS files?',
          options: [
            '@use is not supported by any SCSS compiler',
            'Shopware uses scssphp (a PHP-based SCSS compiler) which relies on @import syntax',
            '@import is the newer, recommended syntax',
            '@use only works with Bootstrap'
          ],
          correct: 1,
          explanation: 'Shopware uses scssphp, a PHP-based SCSS compiler. Dart Sass\'s `@use`/`@forward` syntax is not supported here, so `@import` is always correct.'
        },
        {
          id: 'q-m2-04',
          question: 'What command watches SCSS files and recompiles them automatically during development?',
          options: ['bin/console theme:watch', 'bin/watch-storefront.sh', 'bin/watch-theme.sh', 'bin/console theme:compile --watch'],
          correct: 1,
          explanation: '`bin/watch-storefront.sh` starts a dev server with HMR on port 9998 that auto-recompiles on file changes and provides source maps.'
        },
        {
          id: 'q-m2-05',
          question: 'What is the role of `window.PluginManager` in Shopware storefront JavaScript?',
          options: [
            'It manages npm package dependencies at runtime',
            'It is the global registry for registering and overriding storefront JS plugins',
            'It handles server-side JavaScript rendering',
            'It manages browser extension plugins'
          ],
          correct: 1,
          explanation: '`window.PluginManager` is Shopware\'s custom JavaScript plugin registry, used to `register` new plugins and `override` existing ones.'
        },
        {
          id: 'q-m2-06',
          question: 'What is the first argument passed to `PluginManager.register()`?',
          options: [
            'The CSS selector for the target element',
            'The file path to the plugin class',
            'A unique string name for the plugin',
            'The plugin\'s configuration object'
          ],
          correct: 2,
          explanation: '`PluginManager.register(name, class, selector)` — the first argument is a unique plugin name string, used later when overriding with `PluginManager.override()`.'
        },
        {
          id: 'q-m2-07',
          question: 'Every custom Shopware storefront JavaScript plugin must extend which base class?',
          options: [
            'StorefrontPlugin from src/storefront/plugin.base',
            'Plugin from src/plugin-system/plugin.class',
            'BasePlugin from src/core/plugin.base',
            'Component from src/component/component.class'
          ],
          correct: 1,
          explanation: 'All storefront JS plugins must `import Plugin from \'src/plugin-system/plugin.class\'` and extend it.'
        },
        {
          id: 'q-m2-08',
          question: 'How should you override an async Shopware storefront plugin?',
          options: [
            'Use PluginManager.register() with a standard import',
            'Use PluginManager.asyncOverride() with a static import',
            'Use PluginManager.override() with a dynamic import: () => import(\'./path.plugin\')',
            'Async plugins cannot be overridden'
          ],
          correct: 2,
          explanation: 'If the original plugin is async, your override must also use dynamic import syntax `() => import(...)` so it is also lazy-loaded.'
        },
        {
          id: 'q-m2-09',
          question: 'After writing custom storefront JavaScript, which command compiles it into the `dist` folder?',
          options: ['bin/console plugin:build', 'bin/console theme:compile', 'bin/build-storefront.sh', 'npm run build'],
          correct: 2,
          explanation: '`bin/build-storefront.sh` compiles all storefront JavaScript and places the output in the `dist/` folder which Shopware loads at runtime.'
        },
        {
          id: 'q-m2-10',
          question: 'Which HTML element is recommended as a neutral container for attaching a storefront JavaScript plugin?',
          options: [
            '<div data-plugin> — always visible',
            '<span data-plugin> — inline element',
            '<template data-plugin> — renders no visible content by default',
            '<meta data-plugin> — document metadata'
          ],
          correct: 2,
          explanation: 'The `<template>` element renders no visible content, making it ideal for attaching JS plugins without adding extra markup to the page.'
        }
      ],

      /* Module 2 Flashcards */
      flashcards: [
        { id: 'fc-m2-01', front: '7-1 SCSS pattern folders', back: '`base/`, `components/`, `layout/`, `pages/`, `themes/`, `utils/`, `vendors/` — plus one `base.scss` entry file that imports all others.' },
        { id: 'fc-m2-02', front: 'SCSS entry file name and location', back: '`base.scss` at `src/Resources/app/storefront/src/scss/base.scss`. It imports all partial files.' },
        { id: 'fc-m2-03', front: 'Why @import, not @use in Shopware?', back: 'Shopware compiles SCSS with scssphp (PHP-based), not Dart Sass. scssphp uses `@import` — `@use`/`@forward` are not supported.' },
        { id: 'fc-m2-04', front: '`utils/_variables.scss` purpose', back: 'Defines global SCSS variables: colors, spacing, font sizes, breakpoints. Used across all SCSS files.' },
        { id: 'fc-m2-05', front: '`utils/_mixins.scss` purpose', back: 'Defines reusable `@mixin` functions, used with `@include`. Commonly used for responsive media queries.' },
        { id: 'fc-m2-06', front: 'Bootstrap in Shopware', back: 'Bootstrap is already included — no installation needed. Use classes directly: `row`, `col-md-4`, `btn btn-primary`, `text-center`.' },
        { id: 'fc-m2-07', front: 'Compile SCSS command', back: '`bin/console theme:compile` — processes SCSS and generates final CSS assets.' },
        { id: 'fc-m2-08', front: 'Watch/HMR command', back: '`bin/watch-storefront.sh` — starts dev server on port 9998, auto-recompiles SCSS/JS on file save, provides source maps.' },
        { id: 'fc-m2-09', front: 'window.PluginManager', back: 'Shopware\'s global JS plugin registry. Use it to `register` new plugins and `override` existing ones.' },
        { id: 'fc-m2-10', front: 'PluginManager.register() signature', back: '`PluginManager.register(\'PluginName\', PluginClass, \'[data-selector]\')` — name, class, CSS selector.' },
        { id: 'fc-m2-11', front: 'PluginManager.override() signature', back: '`PluginManager.override(\'ExistingName\', CustomClass, \'[data-selector]\')` — replaces an existing plugin registration.' },
        { id: 'fc-m2-12', front: 'Plugin base class', back: '`import Plugin from \'src/plugin-system/plugin.class\'` — all custom storefront JS plugins must extend this class.' },
        { id: 'fc-m2-13', front: '`init()` method purpose', back: 'The plugin\'s execution entry point. Called automatically when the plugin is attached to its DOM element.' },
        { id: 'fc-m2-14', front: 'Build storefront command', back: '`bin/build-storefront.sh` — compiles JS to `dist/`. Shopware loads from `dist/`, not from `src/`.' },
        { id: 'fc-m2-15', front: 'Async plugin override syntax', back: '`PluginManager.override(\'Name\', () => import(\'./path.plugin\'), \'[selector]\')` — dynamic import matches async original registration.' }
      ]
    },

    /* --------------------------------------------------------
       MODULE 3 — Shopware Theme Development
       -------------------------------------------------------- */
    {
      id: 'module-3',
      title: 'Shopware Theme Development',
      icon: '🎭',
      color: '#e67e22',
      description: 'Create and configure custom themes using theme.json, add configurable settings (colors, fonts), and override SCSS variables for consistent brand styling.',
      sections: [
        {
          id: 'section-3-1',
          title: 'Creating a Theme',
          content: `
<p>Themes are the most powerful way to control the visual identity of a Shopware storefront. A theme can include templates, styles, scripts, and assets.</p>

<h3>Plugin Theme vs. App Theme</h3>
<table style="width:100%;border-collapse:collapse;margin:12px 0">
  <tr style="background:#f4f8fc">
    <th style="padding:10px;border:1px solid #d0e4f5;text-align:left">Plugin Theme</th>
    <th style="padding:10px;border:1px solid #d0e4f5;text-align:left">App Theme</th>
  </tr>
  <tr>
    <td style="padding:10px;border:1px solid #d0e4f5">Full flexibility, including backend PHP logic</td>
    <td style="padding:10px;border:1px solid #d0e4f5">Storefront/style changes only, no backend logic</td>
  </tr>
  <tr style="background:#f4f8fc">
    <td style="padding:10px;border:1px solid #d0e4f5"><code>bin/console theme:create MyTheme</code> auto-generates theme.json</td>
    <td style="padding:10px;border:1px solid #d0e4f5"><code>bin/console app:create MyTheme</code> — must manually add theme.json</td>
  </tr>
</table>

<h3>Creating a Plugin Theme</h3>
<pre><code class="language-bash">bin/console theme:create AcademyTheme</code></pre>
<p>Then install and activate it:</p>
<pre><code class="language-bash">bin/console plugin:install AcademyTheme --activate</code></pre>

<h3>The theme.json File</h3>
<p>The <code>theme.json</code> in <code>src/Resources/</code> is what distinguishes a theme from a regular plugin. It is the central configuration:</p>
<pre><code class="language-json">{
  "name": "AcademyTheme",
  "author": "Shopware AG",
  "description": {
    "en-GB": "Academy plugin theme"
  },
  "views": [
    "@Storefront",
    "@Plugins",
    "@AcademyTheme"
  ],
  "style": [
    "app/storefront/src/scss/overrides.scss",
    "@Storefront",
    "app/storefront/src/scss/base.scss"
  ],
  "script": [
    "@Storefront",
    "app/storefront/dist/storefront/js/academy-theme/academy-theme.js"
  ],
  "asset": [
    "@Storefront",
    "app/storefront/src/assets"
  ],
  "configInheritance": [
    "@Storefront"
  ]
}</code></pre>

<p><strong>Key array behaviors:</strong></p>
<ul>
  <li><code>views</code>: Twig template inheritance order — last entry has highest priority</li>
  <li><code>style</code>: SCSS load order — <code>overrides.scss</code> MUST be first</li>
  <li><code>script</code>: Compiled JS files to load</li>
  <li><code>configInheritance</code>: Which themes' config values to inherit</li>
</ul>

<h3>Assigning a Theme</h3>
<pre><code class="language-bash"># Assign to all sales channels
bin/console theme:change AcademyTheme --all

# Assign to a specific sales channel (interactive)
bin/console theme:change AcademyTheme</code></pre>
<p>Find your theme in Admin: <strong>Extensions → My Extensions → Themes tab</strong></p>
          `
        },
        {
          id: 'section-3-2',
          title: 'Theme Settings & Configuration',
          content: `
<p>The <code>config</code> section in <code>theme.json</code> allows shop owners to adjust theme settings directly in the Shopware Admin — no code changes needed.</p>

<h3>Adding a Color Field</h3>
<pre><code class="language-json">{
  "config": {
    "fields": {
      "academy-color-status-neutral": {
        "label": {
          "en-GB": "Neutral status colour",
          "de-DE": "Neutrale Status Farbe"
        },
        "type": "color",
        "value": "#999999",
        "editable": true,
        "tab": "colours",
        "block": "themeColours",
        "section": "importantColours"
      }
    }
  }
}</code></pre>
<p>The field name <code>academy-color-status-neutral</code> automatically becomes the SCSS variable <code>$academy-color-status-neutral</code> after compilation:</p>
<pre><code class="language-scss">.main-navigation {
  background-color: $academy-color-status-neutral;
}</code></pre>

<h3>Organizing Settings UI (Tabs → Blocks → Sections)</h3>
<pre><code class="language-json">{
  "config": {
    "tabs": {
      "colours": { "label": { "en-GB": "Colours" } }
    },
    "blocks": {
      "themeColours": { "label": { "en-GB": "Theme colours" } }
    },
    "sections": {
      "importantColours": { "label": { "en-GB": "Important colours" } }
    },
    "fields": { ... }
  }
}</code></pre>
<p>Hierarchy: <strong>Tabs (1) → Blocks (2) → Sections (3)</strong>. Each field references its tab, block, and section.</p>

<h3>Inherited Theme Fields</h3>
<p>Themes automatically inherit configuration fields from parent themes. The default fields like <code>sw-color-brand-primary</code> come from <code>vendor/shopware/storefront/theme.json</code>.</p>

<h3>Theme CLI Commands</h3>
<pre><code class="language-bash">bin/console theme:change      # Assign theme to sales channel
bin/console theme:compile     # Compile SCSS and inject config variables
bin/console theme:create      # Create a new theme skeleton
bin/console theme:dump        # Dump config to var/theme-files.json
bin/console theme:refresh     # Refresh theme configuration
bin/console theme:prepare-icons # Prepare icons</code></pre>

<div class="alert alert-warning">
  After adding new config fields, run <code>bin/console theme:compile</code> and possibly <code>cache:clear</code>.
</div>
          `
        },
        {
          id: 'section-3-3',
          title: 'Override SCSS Variables',
          content: `
<p>The most powerful way to maintain a consistent design is to override SCSS variables globally. Variable overrides go in <code>overrides.scss</code>, which must be placed <strong>first</strong> in the <code>style</code> array of <code>theme.json</code>.</p>

<h3>Why overrides.scss Must Be First</h3>
<p>SCSS variable values are resolved at compile time. <code>overrides.scss</code> must be loaded before <code>@Storefront</code> so that when Bootstrap and Shopware compile their styles, they use your overridden variable values.</p>

<pre><code class="language-json">{
  "style": [
    "app/storefront/src/scss/overrides.scss",  ← FIRST
    "@Storefront",
    "app/storefront/src/scss/base.scss"
  ]
}</code></pre>

<h3>Real-World Example: Round All Buttons</h3>
<p>To round all buttons to 5px border-radius:</p>
<pre><code class="language-scss">// In overrides.scss
$btn-border-radius:    5px;  // Standard buttons
$btn-border-radius-lg: 5px;  // Large buttons
$btn-border-radius-sm: 5px;  // Small buttons (close, etc.)
$border-radius:        5px;  // Images and other components</code></pre>

<h3>When No Variable Exists</h3>
<p>Some components override Bootstrap variables with specific CSS. For those, write direct CSS rules in <code>base.scss</code>:</p>
<pre><code class="language-scss">// Fix search field border-radius (no variable available)
.input-group > *:not(:first-child):not(.dropdown-menu) {
  border-radius: 0 5px 5px 0;
}</code></pre>

<h3>Finding the Right Variable</h3>
<p>Use the browser DevTools to inspect the element, then trace the Bootstrap SCSS hierarchy to find the variable controlling that style.</p>

<div class="alert alert-info">
  <strong>Tip:</strong> After making changes, always test across all common views. E2E tests with image diffing (Playwright) can automate this verification.
</div>
          `
        }
      ],

      /* Module 3 Quiz */
      quiz: [
        {
          id: 'q-m3-01',
          question: 'What command creates a new Shopware theme skeleton?',
          options: [
            'bin/console plugin:create --theme MyTheme',
            'bin/console theme:new MyTheme',
            'bin/console theme:create MyTheme',
            'bin/console create:theme MyTheme'
          ],
          correct: 2,
          explanation: '`bin/console theme:create` generates a theme skeleton including the `theme.json` file — the key difference from a plain plugin.'
        },
        {
          id: 'q-m3-02',
          question: 'What is the key file that differentiates a theme from a regular plugin?',
          options: ['style.css', 'theme.json', 'ThemePlugin.php', 'storefront.json'],
          correct: 1,
          explanation: 'The `theme.json` file in `src/Resources/` is what makes a plugin a "theme" in Shopware. It controls views, styles, scripts, assets, and config fields.'
        },
        {
          id: 'q-m3-03',
          question: 'In `theme.json`, where must `overrides.scss` be placed in the `style` array?',
          options: ['Last, after @Storefront', 'After base.scss', 'First, before @Storefront', 'It does not matter'],
          correct: 2,
          explanation: '`overrides.scss` must be first so its SCSS variable values are defined before Storefront/Bootstrap SCSS compiles, allowing the overrides to take effect.'
        },
        {
          id: 'q-m3-04',
          question: 'When creating an app-based theme, what manual step is required?',
          options: [
            'Running bin/console cache:clear',
            'Manually creating the theme.json file in src/Resources/',
            'Installing Node.js separately',
            'Manually registering all Twig blocks'
          ],
          correct: 1,
          explanation: '`bin/console app:create` does not generate `theme.json` automatically. You must create it manually in `src/Resources/`.'
        },
        {
          id: 'q-m3-05',
          question: 'What command assigns a theme to ALL sales channels at once?',
          options: [
            'bin/console theme:assign MyTheme --global',
            'bin/console theme:change MyTheme --all',
            'bin/console theme:apply MyTheme --all-channels',
            'bin/console sales-channel:theme MyTheme'
          ],
          correct: 1,
          explanation: '`bin/console theme:change ThemeName --all` assigns the theme to every configured sales channel at once.'
        },
        {
          id: 'q-m3-06',
          question: 'How does a color field named `my-brand-color` in `theme.json` become usable in SCSS?',
          options: [
            'It must be manually mapped in variables.scss',
            'Shopware injects it as $my-brand-color during theme compilation',
            'You must reference it in configInheritance',
            'You must use a PHP service to generate the variable'
          ],
          correct: 1,
          explanation: 'Shopware\'s theme compiler automatically injects `theme.json` config field values as SCSS variables (field name → `$field-name`) during `theme:compile`.'
        },
        {
          id: 'q-m3-07',
          question: 'What is the correct hierarchy for organizing theme settings from outermost to innermost?',
          options: ['sections → blocks → tabs', 'blocks → tabs → sections', 'tabs → blocks → sections', 'tabs → sections → blocks'],
          correct: 2,
          explanation: 'Tabs (1) are the top level, blocks (2) group fields within a tab, and sections (3) subdivide fields within a block.'
        },
        {
          id: 'q-m3-08',
          question: 'Where are inherited theme configuration fields like `sw-color-brand-primary` defined?',
          options: [
            'In the child theme\'s theme.json',
            'In vendor/shopware/storefront/theme.json',
            'In src/Resources/config/theme-defaults.json',
            'In the Shopware Admin database only'
          ],
          correct: 1,
          explanation: 'The core Storefront theme at `vendor/shopware/storefront/theme.json` defines the default fields like `sw-color-brand-primary` that child themes inherit.'
        },
        {
          id: 'q-m3-09',
          question: 'When should you choose a plugin-based theme over an app-based theme?',
          options: [
            'When you only need to change colors and fonts',
            'When the theme does not need JavaScript',
            'When you need full flexibility including backend PHP logic',
            'When deploying to a cloud environment'
          ],
          correct: 2,
          explanation: 'Plugin themes can include PHP controllers, services, and business logic. App themes are limited to storefront/style changes only.'
        },
        {
          id: 'q-m3-10',
          question: 'What does the `configInheritance` key in `theme.json` control?',
          options: [
            'The PHP class inheritance for the theme',
            'Whether users can edit config fields in the Admin',
            'The order in which theme configuration values are inherited from parent themes',
            'The SCSS compilation order'
          ],
          correct: 2,
          explanation: '`configInheritance` defines which parent themes\' config values your theme inherits and in what priority order.'
        }
      ],

      /* Module 3 Flashcards */
      flashcards: [
        { id: 'fc-m3-01', front: 'Create a theme command', back: '`bin/console theme:create MyTheme` — generates skeleton including `theme.json` in `custom/plugins/`.' },
        { id: 'fc-m3-02', front: 'What makes a plugin a "theme"?', back: 'The presence of a `theme.json` file in `src/Resources/`.' },
        { id: 'fc-m3-03', front: 'App theme vs Plugin theme', back: 'App theme: style-only, no backend PHP. Plugin theme: full flexibility including server-side logic.' },
        { id: 'fc-m3-04', front: 'theme.json main sections', back: '`name`, `author`, `description`, `views`, `style`, `script`, `asset`, `configInheritance`, `config`' },
        { id: 'fc-m3-05', front: 'Assign theme to all sales channels', back: '`bin/console theme:change MyTheme --all`' },
        { id: 'fc-m3-06', front: 'Why overrides.scss must be first in style[]', back: 'SCSS variables must be set before Bootstrap/Storefront compiles, or the overrides won\'t affect the compiled output.' },
        { id: 'fc-m3-07', front: 'Theme config field → SCSS variable', back: 'Field name `my-field-name` becomes `$my-field-name` SCSS variable, injected at compile time by `theme:compile`.' },
        { id: 'fc-m3-08', front: 'Theme settings hierarchy', back: 'Tabs (1) → Blocks (2) → Sections (3). Each field references its tab, block, and section.' },
        { id: 'fc-m3-09', front: 'bin/console theme:compile', back: 'Compiles all SCSS, injects theme config values as variables, builds final CSS assets.' },
        { id: 'fc-m3-10', front: 'Where inherited config fields come from', back: '`vendor/shopware/storefront/theme.json` defines default fields like `sw-color-brand-primary` that child themes inherit.' },
        { id: 'fc-m3-11', front: '$btn-border-radius', back: 'Bootstrap SCSS variable controlling border-radius of standard-sized buttons. Override in `overrides.scss`.' },
        { id: 'fc-m3-12', front: '$border-radius', back: 'Bootstrap SCSS variable controlling default border-radius on images and other components. Override in `overrides.scss`.' },
        { id: 'fc-m3-13', front: 'App theme: manual step required', back: 'Manually create `theme.json` in `src/Resources/` — `app:create` does not generate it automatically.' },
        { id: 'fc-m3-14', front: 'Find theme in Admin', back: 'Extensions → My Extensions → Themes (tab)' },
        { id: 'fc-m3-15', front: 'bin/console theme:dump', back: 'Dumps the current theme configuration to `var/theme-files.json`. Useful for debugging.' }
      ]
    },

    /* --------------------------------------------------------
       MODULE 4 — Shopware Storefront Testing and Debugging
       -------------------------------------------------------- */
    {
      id: 'module-4',
      title: 'Storefront Testing & Debugging',
      icon: '🔬',
      color: '#27ae60',
      description: 'Master debugging tools (dump, Symfony Profiler, FroshDeveloperHelper) and learn to write automated E2E tests with Playwright — the default testing framework since Shopware 6.7.',
      sections: [
        {
          id: 'section-4-1',
          title: 'Debugging Your Storefront',
          content: `
<h3>Prerequisites: Development Mode</h3>
<p>Most debugging tools require development mode. Set in <code>.env</code>:</p>
<pre><code class="language-bash">APP_ENV=dev
# Then clear the cache:
bin/console cache:clear</code></pre>

<h3>Twig: dump()</h3>
<p>The <code>dump()</code> function is a powerful debugging tool — use it in any Twig template to inspect available variables:</p>
<pre><code class="language-twig">{{ dump() }}        {# outputs ALL template variables #}
{{ dump(product) }} {# outputs a specific variable #}</code></pre>
<div class="alert alert-warning">
  <strong>Dev-only:</strong> <code>dump()</code> only works when <code>APP_ENV=dev</code>. Never leave dump calls in production templates.
</div>

<h3>FroshDeveloperHelper Plugin</h3>
<p>Install via Composer:</p>
<pre><code class="language-bash">composer require frosh/development-helper</code></pre>
<p>Features:</p>
<ul>
  <li><strong>HTML comments</strong> showing Twig block and include names directly in the page source</li>
  <li>Disables Twig template caching for instant feedback</li>
  <li>Adds a <strong>Twig Variables</strong> tab to the Symfony Profiler</li>
</ul>

<h3>Symfony Profiler</h3>
<p>The Symfony Profiler is available in dev mode. Useful for storefront development:</p>
<ul>
  <li>See which <strong>Twig templates were loaded</strong> for a request</li>
  <li>View available <strong>translations</strong></li>
  <li>Inspect request/response details</li>
  <li>Check database queries and performance</li>
</ul>

<h3>SCSS Debugging: HMR Watcher</h3>
<p>Run the watcher to get source maps — DevTools then shows which SCSS file each style comes from:</p>
<pre><code class="language-bash">bin/watch-storefront.sh   # Starts on port 9998</code></pre>

<h3>JavaScript Debugging: Browser DevTools</h3>
<ul>
  <li><strong>Console</strong>: Check for errors and <code>console.log()</code> output from plugins</li>
  <li><strong>Network</strong>: Inspect Ajax requests and responses</li>
  <li><strong>Sources</strong>: Set breakpoints and step through JS code</li>
</ul>
<p>Since Shopware 6.5+, JS files are split into modules (not one big file), making debugging much easier.</p>

<h3>Meteor Shopware 6 Toolkit</h3>
<p>A <strong>Chrome extension</strong> that adds a toolbar button to quickly jump from a storefront product detail page or category page to the corresponding item in the Shopware Admin. Saves significant time during development.</p>
          `
        },
        {
          id: 'section-4-2',
          title: 'E2E Testing with Playwright',
          content: `
<p>Starting with <strong>Shopware 6.7</strong>, <strong>Playwright</strong> replaces Cypress as the default end-to-end testing framework. It provides faster execution, better cross-browser support, and a more robust developer experience.</p>

<h3>Folder Structure</h3>
<pre><code class="language-bash">PluginRoot/
└── tests/
    └── acceptance/
        ├── tests/
        │   ├── product-buy-widget.spec.ts
        │   └── BaseTestFile.ts
        ├── .env              # Copy from .env.dist, set APP_URL
        ├── .env.dist
        ├── package.json
        └── playwright.config.ts</code></pre>

<h3>playwright.config.ts</h3>
<pre><code class="language-javascript">import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,    // 2 retries in CI, 0 locally
    workers: process.env.CI ? 1 : undefined, // sequential in CI
    reporter: 'html',
    use: {
        screenshot: 'only-on-failure',
        baseURL: process.env.APP_URL,
        trace: 'on-first-retry',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    ],
});</code></pre>

<h3>BaseTestFile.ts</h3>
<pre><code class="language-javascript">import { test as base } from '@shopware-ag/acceptance-test-suite';
import type { FixtureTypes } from '@shopware-ag/acceptance-test-suite';

export * from '@shopware-ag/acceptance-test-suite';

export const test = base.extend&lt;FixtureTypes&gt;({
    // Add custom fixtures here
});</code></pre>

<h3>Writing a Test</h3>
<pre><code class="language-javascript">import { expect, test } from './BaseTestFile';

test('Product buy widget is present.', async ({ page, TestDataService, DefaultSalesChannel }) => {
    // Create test data via the Shopware API
    const basicProduct = await TestDataService.createBasicProduct();

    // Navigate to the product detail page
    await page.goto(\`\${DefaultSalesChannel.url}/detail/\${basicProduct.id}\`);

    // Assert element exists
    const openImageModalLink = page.locator('a.open-image-modal');
    await expect(openImageModalLink).toHaveCount(1);
});</code></pre>

<h3>Running Tests Locally</h3>
<pre><code class="language-bash"># Navigate to test folder FIRST
cd custom/plugins/MyPlugin/tests/acceptance

# Install dependencies
npm install
npx playwright install
npx playwright install-deps

# Run with interactive UI
npx playwright test --ui

# Run headless in terminal
npx playwright test</code></pre>

<h3>CI Integration (GitHub Actions)</h3>
<p>The workflow file (<code>.github/workflows/e2e.yml</code>) must be committed to the repository. Required parameters:</p>
<ul>
  <li><code>extensionName</code>: Plugin name (same as repository name)</li>
  <li><code>e2ePath</code>: Path to the <code>tests/acceptance</code> folder</li>
  <li><code>shopwareVersion</code>: Shopware version to test against</li>
  <li><code>e2eTestFramework: playwright</code></li>
</ul>

<div class="alert alert-info">
  All Playwright commands must be run from inside the <code>tests/acceptance/</code> folder — that's where <code>package.json</code> and <code>playwright.config.ts</code> live.
</div>
          `
        }
      ],

      /* Module 4 Quiz */
      quiz: [
        {
          id: 'q-m4-01',
          question: 'In which environment is the Twig `dump()` function available?',
          options: ['Production only', 'All environments', 'Development environment only (APP_ENV=dev)', 'Staging and production'],
          correct: 2,
          explanation: '`dump()` is a debugging tool that only works when `APP_ENV=dev` is set in the `.env` file.'
        },
        {
          id: 'q-m4-02',
          question: 'What does the FroshDeveloperHelper plugin add to your Shopware HTML output?',
          options: [
            'Performance benchmarks in the page footer',
            'HTML comments showing Twig block and include names',
            'A floating debug panel in the browser',
            'JavaScript console warnings for deprecated functions'
          ],
          correct: 1,
          explanation: 'FroshDeveloperHelper injects HTML comments into the rendered page that reveal which Twig blocks surround each section of the HTML.'
        },
        {
          id: 'q-m4-03',
          question: 'Which tool shows you which Twig templates were loaded for a specific page request?',
          options: ['Browser DevTools Sources tab', 'Frosh Development Helper HTML comments', 'Symfony Profiler', 'bin/console debug:twig'],
          correct: 2,
          explanation: 'The Symfony Profiler has a dedicated Twig panel showing all templates rendered during a request, including rendering times.'
        },
        {
          id: 'q-m4-04',
          question: 'On which port does `bin/watch-storefront.sh` serve the HMR dev server by default?',
          options: ['8000', '3000', '9998', '4200'],
          correct: 2,
          explanation: 'The Shopware storefront watcher runs on port 9998 by default, accessible at `localhost:9998`.'
        },
        {
          id: 'q-m4-05',
          question: 'What is the Meteor Shopware 6 Toolkit?',
          options: [
            'A CLI tool for building Shopware themes',
            'A Chrome extension that links storefront pages to their Admin counterparts',
            'A PHP library for Shopware testing',
            'A VS Code extension for Twig syntax highlighting'
          ],
          correct: 1,
          explanation: 'The Meteor Shopware 6 Toolkit is a Chrome extension that lets developers quickly jump from a product detail page to the corresponding product in the Shopware Admin.'
        },
        {
          id: 'q-m4-06',
          question: 'Starting with which Shopware version did Playwright replace Cypress as the default E2E framework?',
          options: ['Shopware 6.5', 'Shopware 6.6', 'Shopware 6.7', 'Shopware 7.0'],
          correct: 2,
          explanation: 'Playwright replaced Cypress as Shopware\'s default E2E framework starting with Shopware 6.7.'
        },
        {
          id: 'q-m4-07',
          question: 'From which directory must you run `npx playwright test` commands?',
          options: [
            'The Shopware root directory',
            'The plugin root directory',
            'custom/plugins/<PluginName>/',
            'tests/acceptance/ inside the plugin'
          ],
          correct: 3,
          explanation: 'The `tests/acceptance/` folder contains `package.json` and `playwright.config.ts`, so all Playwright commands must be run from that directory.'
        },
        {
          id: 'q-m4-08',
          question: 'What is the purpose of `BaseTestFile.ts` in a Playwright test suite?',
          options: [
            'It defines the Playwright browser configuration',
            'It extends @shopware-ag/acceptance-test-suite and is imported by all test files',
            'It stores test fixtures like product data',
            'It configures the CI environment variables'
          ],
          correct: 1,
          explanation: '`BaseTestFile.ts` wraps the Shopware acceptance test suite base. Individual test files import from it to get Shopware-specific fixtures like `TestDataService`.'
        },
        {
          id: 'q-m4-09',
          question: 'In `playwright.config.ts`, what does `retries: process.env.CI ? 2 : 0` accomplish?',
          options: [
            'Tests retry 2 times locally and never retry in CI',
            'Tests retry 2 times in CI environments but not locally',
            'Tests always retry exactly 2 times',
            'Retries are disabled in all environments'
          ],
          correct: 1,
          explanation: '`process.env.CI` is set in CI environments (GitHub Actions). 2 retries in CI accounts for potential flakiness; 0 locally gives faster feedback.'
        },
        {
          id: 'q-m4-10',
          question: 'Which of the following is NOT a required parameter when running Playwright tests in GitHub Actions CI?',
          options: ['extensionName', 'e2ePath', 'shopwareVersion', 'playwrightVersion'],
          correct: 3,
          explanation: 'The required CI parameters are `extensionName`, `e2ePath`, `shopwareVersion`, and `e2eTestFramework`. `playwrightVersion` is not a documented required parameter.'
        }
      ],

      /* Module 4 Flashcards */
      flashcards: [
        { id: 'fc-m4-01', front: 'Enable development mode', back: 'Set `APP_ENV=dev` in `.env`, then `bin/console cache:clear`. Enables dump(), detailed errors, and debugging tools.' },
        { id: 'fc-m4-02', front: 'Twig dump() usage', back: '`{{ dump() }}` — all template variables. `{{ dump(product) }}` — specific variable. Dev-only tool.' },
        { id: 'fc-m4-03', front: 'FroshDeveloperHelper install', back: '`composer require frosh/development-helper` — adds HTML comments with block names, disables Twig cache, adds Twig tab to Symfony Profiler.' },
        { id: 'fc-m4-04', front: 'Symfony Profiler for Twig', back: 'Shows all Twig templates loaded for a request, rendering times, and available translations.' },
        { id: 'fc-m4-05', front: 'HMR for SCSS debugging', back: '`bin/watch-storefront.sh` — enables source maps so DevTools shows which SCSS file each style comes from.' },
        { id: 'fc-m4-06', front: 'Meteor Shopware 6 Toolkit', back: 'Chrome extension. Lets you jump from a storefront product/category page directly to its Admin counterpart.' },
        { id: 'fc-m4-07', front: 'Playwright vs Cypress', back: 'Playwright replaced Cypress as Shopware\'s default E2E framework in Shopware 6.7. Faster, better cross-browser support.' },
        { id: 'fc-m4-08', front: 'Playwright test folder location', back: '`tests/acceptance/` inside the plugin root — contains `playwright.config.ts`, `BaseTestFile.ts`, `package.json`.' },
        { id: 'fc-m4-09', front: 'playwright.config.ts: retries in CI', back: '`retries: process.env.CI ? 2 : 0` — 2 retries in CI for stability, 0 locally for fast feedback.' },
        { id: 'fc-m4-10', front: 'playwright.config.ts: workers in CI', back: '`workers: process.env.CI ? 1 : undefined` — sequential in CI to avoid resource conflicts, parallel locally.' },
        { id: 'fc-m4-11', front: 'BaseTestFile.ts purpose', back: 'Extends `@shopware-ag/acceptance-test-suite`. All test files import from here to get Shopware fixtures like `TestDataService`.' },
        { id: 'fc-m4-12', front: 'Run tests with interactive UI', back: '`npx playwright test --ui` — from the `tests/acceptance/` folder.' },
        { id: 'fc-m4-13', front: 'CI required parameters', back: '`extensionName`, `e2ePath`, `shopwareVersion`, `e2eTestFramework: playwright`' },
        { id: 'fc-m4-14', front: 'GitHub Actions workflow location', back: '`.github/workflows/e2e.yml` inside the plugin repository. Must be committed to be triggered automatically.' },
        { id: 'fc-m4-15', front: 'TestDataService in tests', back: 'Provides helpers like `createBasicProduct()` that create test data via the Shopware API for use in test scenarios.' }
      ]
    }
  ],

  /* ==========================================================
     EXAM QUESTIONS — 50 questions across all modules
     ========================================================== */
  examQuestions: [
    /* Module 1: Twig Templating — Q01–Q13 */
    {
      id: 'eq-01', moduleId: 'module-1',
      question: 'What is Twig in Shopware?',
      options: ['A JavaScript framework for rendering UI components', 'A CSS preprocessor used in Shopware', 'A server-side PHP templating engine used in Shopware', 'A Shopware-specific database query language'],
      correct: 2, explanation: 'Twig is a server-side PHP templating engine. All Twig code is processed before the HTML is sent to the browser.'
    },
    {
      id: 'eq-02', moduleId: 'module-1',
      question: 'Where are plugin template files placed to override Shopware core templates?',
      options: ['src/Resources/templates/', 'src/Resources/views/storefront/', 'src/Twig/views/', 'resources/views/'],
      correct: 1, explanation: 'Templates go in `src/Resources/views/storefront/` and must mirror the exact file path of the core template.'
    },
    {
      id: 'eq-03', moduleId: 'module-1',
      question: 'Which command installs AND activates a Shopware plugin in one step?',
      options: ['bin/console plugin:install MyPlugin --run', 'bin/console plugin:install MyPlugin --activate', 'bin/console plugin:enable MyPlugin', 'bin/console plugin:start MyPlugin'],
      correct: 1, explanation: '`bin/console plugin:install PluginName --activate` installs and activates the plugin in a single command.'
    },
    {
      id: 'eq-04', moduleId: 'module-1',
      question: 'What is `base.html.twig` in Shopware\'s storefront?',
      options: ['A blank placeholder file for custom themes', 'The root template from which all storefront pages inherit', 'A configuration file for base styles', 'The default product listing template'],
      correct: 1, explanation: '`base.html.twig` is the root Twig template for all storefront pages. All other templates inherit from it.'
    },
    {
      id: 'eq-05', moduleId: 'module-1',
      question: 'What is the Shopware-specific tag used to inherit from another template?',
      options: ['{% extends %}', '{% twig_extends %}', '{% sw_extends %}', '{% inherit %}'],
      correct: 2, explanation: '`sw_extends` is Shopware\'s wrapper around Twig\'s `extends` that follows the plugin/theme inheritance order.'
    },
    {
      id: 'eq-06', moduleId: 'module-1',
      question: 'How do you include the parent block\'s original content when overriding a Twig block?',
      options: ['{{ block.parent() }}', '{{ super() }}', '{% include_parent %}', '{{ parent() }}'],
      correct: 3, explanation: '`parent()` outputs the parent template\'s block content so you can extend rather than fully replace it.'
    },
    {
      id: 'eq-07', moduleId: 'module-1',
      question: 'What does `{% sw_include \'template.twig\' ignore missing %}` do?',
      options: ['Includes the template and ignores its blocks', 'Includes the template silently even if the file does not exist', 'Includes the template but strips all HTML comments', 'Includes only non-mandatory blocks'],
      correct: 1, explanation: '`ignore missing` suppresses errors if the included template file does not exist — useful for optional template partials.'
    },
    {
      id: 'eq-08', moduleId: 'module-1',
      question: 'In Twig, how do you perform a strict type-and-value comparison?',
      options: ['is equal to', 'is same as', '===', 'is identical'],
      correct: 1, explanation: 'Twig uses `is same as` for strict comparison (checks both value and type), equivalent to PHP\'s `===`.'
    },
    {
      id: 'eq-09', moduleId: 'module-1',
      question: 'What special variable gives you the current loop iteration number in a Twig `for` loop?',
      options: ['loop.count', 'loop.current', 'loop.iteration', 'loop.index'],
      correct: 3, explanation: '`loop.index` provides the current 1-based iteration number. `loop.length` gives the total number of items.'
    },
    {
      id: 'eq-10', moduleId: 'module-1',
      question: 'What does the `|currency` filter do in Shopware?',
      options: ['Converts a string to uppercase currency code', 'Formats a number using the active sales channel\'s currency and locale', 'Multiplies a value by the current exchange rate', 'Strips currency symbols from a string'],
      correct: 1, explanation: '`|currency` is a Shopware-specific filter that formats prices using the active sales channel\'s configured currency and locale.'
    },
    {
      id: 'eq-11', moduleId: 'module-1',
      question: 'What does the `|default(\'fallback\')` Twig filter do?',
      options: ['Sets the variable globally if undefined', 'Returns \'fallback\' if the variable is undefined or empty', 'Translates the variable using a fallback locale', 'Converts the variable to its default PHP type'],
      correct: 1, explanation: '`|default()` returns the specified fallback value if the variable is undefined, null, or empty string.'
    },
    {
      id: 'eq-12', moduleId: 'module-1',
      question: 'What is the purpose of the `config()` Twig function in Shopware?',
      options: ['To read Twig block configuration', 'To load Bootstrap configuration', 'To retrieve a system configuration value from the Shopware database', 'To configure the Twig environment settings'],
      correct: 2, explanation: '`config()` reads a Shopware system configuration value by its dot-notation path: `PluginName.config.fieldName`.'
    },
    {
      id: 'eq-13', moduleId: 'module-1',
      question: 'What must you run BEFORE `plugin:install` when creating a new plugin?',
      options: ['bin/console plugin:detect', 'bin/console cache:clear', 'bin/console plugin:refresh', 'bin/console plugin:list'],
      correct: 2, explanation: '`plugin:refresh` scans `custom/plugins/` to detect newly created plugins so they become available for install.'
    },

    /* Module 2: SCSS + JavaScript — Q14–Q26 */
    {
      id: 'eq-14', moduleId: 'module-2',
      question: 'What does the 7-1 SCSS pattern consist of?',
      options: ['7 SCSS variable files and 1 mixin file', '7 theme files and 1 plugin file', '7 category folders and 1 main entry file', '7 Bootstrap overrides and 1 custom stylesheet'],
      correct: 2, explanation: 'The 7-1 pattern uses 7 folders (`base`, `components`, `layout`, `pages`, `themes`, `utils`, `vendors`) and one `base.scss` entry file.'
    },
    {
      id: 'eq-15', moduleId: 'module-2',
      question: 'Under which path should all custom SCSS files be placed in a Shopware plugin?',
      options: ['src/Resources/public/css/', 'src/Resources/storefront/scss/', 'src/Resources/app/storefront/src/scss/', 'src/Css/storefront/'],
      correct: 2, explanation: 'All plugin SCSS lives under `src/Resources/app/storefront/src/scss/` with `base.scss` as the entry point.'
    },
    {
      id: 'eq-16', moduleId: 'module-2',
      question: 'What goes in the `utils/` folder of the 7-1 SCSS pattern?',
      options: ['External vendor libraries', 'Page-specific styles', 'Helper files like variables and mixins', 'Theme color definitions'],
      correct: 2, explanation: 'The `utils/` folder contains helper files (`_variables.scss`, `_mixins.scss`) that are used across all other SCSS files.'
    },
    {
      id: 'eq-17', moduleId: 'module-2',
      question: 'Which SCSS syntax is used in Shopware and why?',
      options: ['@use — because Shopware uses Dart Sass', '@import — because Shopware uses scssphp, a PHP-based SCSS compiler', '@forward — because it is the modern standard', '@require — because it is Shopware-specific'],
      correct: 1, explanation: 'Shopware uses scssphp, a PHP-based compiler. Dart Sass\'s `@use`/`@forward` are not supported — always use `@import`.'
    },
    {
      id: 'eq-18', moduleId: 'module-2',
      question: 'Bootstrap is included in Shopware. What does this mean for your project?',
      options: ['You must install Bootstrap via npm before using it', 'You can use Bootstrap classes and components directly without additional installation', 'You must import Bootstrap SCSS manually in your plugin', 'Only Bootstrap grid is available; components must be added separately'],
      correct: 1, explanation: 'Bootstrap is bundled with Shopware — you can use grid classes, button classes, utility classes etc. without any extra setup.'
    },
    {
      id: 'eq-19', moduleId: 'module-2',
      question: 'What does `bin/build-storefront.sh` do?',
      options: ['Compiles SCSS files only', 'Starts a development server for the storefront', 'Compiles storefront JavaScript and places output in the dist/ folder', 'Installs all npm dependencies'],
      correct: 2, explanation: '`bin/build-storefront.sh` compiles all storefront JS plugins and puts the output in `dist/` — the folder Shopware loads at runtime.'
    },
    {
      id: 'eq-20', moduleId: 'module-2',
      question: 'Which base class must all custom Shopware storefront JavaScript plugins extend?',
      options: ['ShopwarePlugin from src/core/shopware-plugin', 'BasePlugin from src/plugin-system/base-plugin', 'Plugin from src/plugin-system/plugin.class', 'StorefrontPlugin from src/storefront/storefront-plugin'],
      correct: 2, explanation: 'All storefront JS plugins must `import Plugin from \'src/plugin-system/plugin.class\'` and extend it.'
    },
    {
      id: 'eq-21', moduleId: 'module-2',
      question: 'How do you link a storefront JavaScript plugin to a specific HTML element?',
      options: ['By adding the plugin class name as a CSS class', 'By referencing the element\'s ID in the plugin\'s init()', 'By registering the plugin with a CSS selector in PluginManager.register()', 'By defining the element in plugin\'s theme.json'],
      correct: 2, explanation: 'The third argument of `PluginManager.register()` is a CSS selector. Shopware attaches the plugin to all matching elements.'
    },
    {
      id: 'eq-22', moduleId: 'module-2',
      question: 'What is the `init()` method in a Shopware storefront JavaScript plugin?',
      options: ['A static factory method for creating plugin instances', 'The method called when the plugin is instantiated; acts as the execution entry point', 'A method that initializes the Shopware PluginManager', 'A lifecycle hook called before the plugin is destroyed'],
      correct: 1, explanation: '`init()` is automatically called when the plugin is attached to its DOM element. It\'s where you set up event listeners and custom functionality.'
    },
    {
      id: 'eq-23', moduleId: 'module-2',
      question: 'What is the difference between extending and overriding a Shopware storefront JavaScript plugin?',
      options: ['They are identical — both replace all plugin methods', 'Overriding keeps the original code; extending replaces it', 'Extending calls super.method() to keep original behavior; overriding replaces the method entirely', 'Extending uses PluginManager.extend(); overriding uses PluginManager.replace()'],
      correct: 2, explanation: 'When you call `super.methodName()` inside your overridden method, you extend the original behavior. Without `super`, you fully replace it.'
    },
    {
      id: 'eq-24', moduleId: 'module-2',
      question: 'Why do async storefront plugins exist in Shopware?',
      options: ['To improve security by delaying initialization', 'To reduce initial JS payload by loading plugins only when needed on specific pages', 'Because all storefront plugins must be async in modern Shopware', 'To allow plugins to run after all synchronous PHP code completes'],
      correct: 1, explanation: 'Async plugins load only when needed (product detail, checkout, etc.), keeping the initial storefront JS bundle smaller for better performance.'
    },
    {
      id: 'eq-25', moduleId: 'module-2',
      question: 'What element is recommended as a neutral container for attaching a storefront JavaScript plugin?',
      options: ['<div data-plugin> — always visible', '<span data-plugin> — inline element', '<template data-plugin> — renders no visible content by default', '<meta data-plugin> — document metadata'],
      correct: 2, explanation: 'The `<template>` element renders no visible content, making it ideal for attaching JS plugins without adding extra visible markup.'
    },
    {
      id: 'eq-26', moduleId: 'module-2',
      question: 'What does `bin/watch-storefront.sh` do that `bin/build-storefront.sh` does NOT?',
      options: ['It compiles SCSS files', 'It starts a live dev server with HMR that auto-recompiles on file changes', 'It deploys the storefront to production', 'It runs unit tests'],
      correct: 1, explanation: '`watch-storefront.sh` starts a live dev server with Hot Module Replacement on port 9998. `build-storefront.sh` does a one-time build to the `dist/` folder.'
    },

    /* Module 3: Theme Development — Q27–Q39 */
    {
      id: 'eq-27', moduleId: 'module-3',
      question: 'What is the key structural difference between a Shopware theme and a regular plugin?',
      options: ['Themes live in custom/themes/; plugins live in custom/plugins/', 'Themes have a theme.json file; plugins do not', 'Themes cannot contain PHP code; plugins can', 'Themes use Twig 3; plugins use Twig 2'],
      correct: 1, explanation: 'The presence of `theme.json` in `src/Resources/` is what makes a plugin a "theme" in Shopware.'
    },
    {
      id: 'eq-28', moduleId: 'module-3',
      question: 'What does the `views` array in `theme.json` control?',
      options: ['Which Bootstrap components are loaded', 'The Twig template inheritance order for the theme', 'The list of admin view files', 'Which sales channels the theme applies to'],
      correct: 1, explanation: '`views` defines the Twig template inheritance order. The last entry has the highest priority and overrides all earlier entries.'
    },
    {
      id: 'eq-29', moduleId: 'module-3',
      question: 'In `theme.json`, which position in the `style` array should `overrides.scss` occupy?',
      options: ['Last', 'Middle', 'First', 'Position does not matter'],
      correct: 2, explanation: '`overrides.scss` must be first so its SCSS variable values are set before Bootstrap/Storefront SCSS compiles.'
    },
    {
      id: 'eq-30', moduleId: 'module-3',
      question: 'A color config field named `my-brand-color` in `theme.json` becomes which SCSS variable?',
      options: ['$my_brand_color', '$myBrandColor', '$my-brand-color', 'var(--my-brand-color)'],
      correct: 2, explanation: 'Shopware converts the field name directly to a SCSS variable by prepending `$`. Hyphens are preserved.'
    },
    {
      id: 'eq-31', moduleId: 'module-3',
      question: 'What does `bin/console theme:change MyTheme --all` do?',
      options: ['Changes the theme name globally', 'Assigns the specified theme to all sales channels', 'Updates all theme configuration fields to defaults', 'Resets all theme overrides'],
      correct: 1, explanation: '`theme:change ThemeName --all` assigns the theme to every configured sales channel simultaneously.'
    },
    {
      id: 'eq-32', moduleId: 'module-3',
      question: 'Where does Shopware look for inherited theme config fields like `sw-color-brand-primary`?',
      options: ['The child theme\'s theme.json', 'vendor/shopware/storefront/theme.json', 'src/Resources/config/theme-defaults.json', 'The Shopware Admin database only'],
      correct: 1, explanation: 'The core Storefront theme at `vendor/shopware/storefront/theme.json` defines the default fields that child themes inherit.'
    },
    {
      id: 'eq-33', moduleId: 'module-3',
      question: 'After adding new configuration fields to `theme.json`, what commands must you run?',
      options: ['plugin:refresh then plugin:install', 'theme:compile and optionally cache:clear', 'build-storefront.sh then watch-storefront.sh', 'theme:refresh then theme:change'],
      correct: 1, explanation: '`theme:compile` processes the new config fields and injects them as SCSS variables. `cache:clear` may also be needed.'
    },
    {
      id: 'eq-34', moduleId: 'module-3',
      question: 'When should you choose an app-based theme over a plugin-based theme?',
      options: ['When you need custom PHP controllers', 'When you need to override backend business logic', 'When the theme involves only storefront styling and template changes', 'When deploying to a self-hosted environment'],
      correct: 2, explanation: 'App themes are ideal for style-only changes. Plugin themes should be used when you need PHP backend logic, controllers, or services.'
    },
    {
      id: 'eq-35', moduleId: 'module-3',
      question: 'What Bootstrap variables would you override in `overrides.scss` to round ALL button sizes?',
      options: ['$button-radius, $button-lg-radius, $button-sm-radius', '$btn-border-radius, $btn-border-radius-lg, $btn-border-radius-sm', '$btn-radius, $btn-radius-large, $btn-radius-small', '$border-round, $border-round-lg, $border-round-sm'],
      correct: 1, explanation: 'The correct Bootstrap variable names are `$btn-border-radius`, `$btn-border-radius-lg`, and `$btn-border-radius-sm`.'
    },
    {
      id: 'eq-36', moduleId: 'module-3',
      question: 'What does the `configInheritance` key in `theme.json` control?',
      options: ['PHP class inheritance for the theme', 'The order in which theme configuration values are inherited from parent themes', 'Which users can modify theme configuration', 'Mapping SCSS variables to config field names'],
      correct: 1, explanation: '`configInheritance` defines which parent themes\' config values your theme inherits and in what priority order.'
    },
    {
      id: 'eq-37', moduleId: 'module-3',
      question: 'What command creates a new Shopware theme skeleton including theme.json?',
      options: ['bin/console plugin:create --theme MyTheme', 'bin/console theme:create MyTheme', 'bin/console make:theme MyTheme', 'bin/console theme:generate MyTheme'],
      correct: 1, explanation: '`bin/console theme:create` generates the theme skeleton including `theme.json`, which differentiates it from a plain plugin.'
    },
    {
      id: 'eq-38', moduleId: 'module-3',
      question: 'What is the hierarchy of theme settings UI groupings from outermost to innermost?',
      options: ['sections → blocks → tabs', 'blocks → tabs → sections', 'tabs → blocks → sections', 'tabs → sections → blocks'],
      correct: 2, explanation: 'Tabs (1) are top level, Blocks (2) group fields within a tab, Sections (3) subdivide fields within a block.'
    },
    {
      id: 'eq-39', moduleId: 'module-3',
      question: 'In `theme.json`, the `script` array should reference which file for compiled theme JavaScript?',
      options: ['app/storefront/src/main.js', 'app/storefront/dist/storefront/js/<theme-name>/<theme-name>.js', '@StorefrontJs', 'src/Resources/public/js/theme.js'],
      correct: 1, explanation: 'The script array references the compiled dist file: `app/storefront/dist/storefront/js/<theme-name>/<theme-name>.js`.'
    },

    /* Module 4: Testing & Debugging — Q40–Q50 */
    {
      id: 'eq-40', moduleId: 'module-4',
      question: 'The `APP_ENV=dev` environment variable enables which key debugging feature?',
      options: ['Production-level logging', 'The Twig dump() function and more detailed error messages', 'Permanently disables all caching', 'Switches to a test database'],
      correct: 1, explanation: '`APP_ENV=dev` enables development mode, which activates `dump()`, shows detailed error messages, and enables the Symfony Profiler.'
    },
    {
      id: 'eq-41', moduleId: 'module-4',
      question: 'Which debugging tool specifically shows Twig block names as HTML comments in the page source?',
      options: ['Symfony Profiler', 'Browser DevTools', 'Frosh Development Helper', 'Meteor Shopware 6 Toolkit'],
      correct: 2, explanation: 'FroshDeveloperHelper injects HTML comments into the rendered page showing which Twig blocks surround each section.'
    },
    {
      id: 'eq-42', moduleId: 'module-4',
      question: 'What additional tab does the FroshDeveloperHelper plugin add to the Symfony Profiler?',
      options: ['SCSS variables', 'JavaScript plugins', 'Twig variables', 'Plugin registry'],
      correct: 2, explanation: 'FroshDeveloperHelper adds a dedicated "Twig variables" tab to the Symfony Profiler showing all variables available in each template.'
    },
    {
      id: 'eq-43', moduleId: 'module-4',
      question: 'Playwright replaced which E2E testing framework in Shopware 6.7?',
      options: ['Jest', 'Cypress', 'Selenium', 'WebdriverIO'],
      correct: 1, explanation: 'Playwright replaced Cypress as Shopware\'s default E2E testing framework starting with Shopware 6.7.'
    },
    {
      id: 'eq-44', moduleId: 'module-4',
      question: 'In which folder are Playwright tests located within a Shopware plugin?',
      options: ['tests/e2e/', 'tests/playwright/', 'tests/acceptance/', 'e2e/tests/'],
      correct: 2, explanation: 'Playwright tests are in `tests/acceptance/` inside the plugin root. This folder also contains `package.json` and `playwright.config.ts`.'
    },
    {
      id: 'eq-45', moduleId: 'module-4',
      question: 'What does `BaseTestFile.ts` in the Playwright test suite extend?',
      options: ['Native @playwright/test only', '@shopware-ag/acceptance-test-suite', 'Cypress test fixtures', 'Shopware\'s Admin API client'],
      correct: 1, explanation: '`BaseTestFile.ts` extends `@shopware-ag/acceptance-test-suite` base test. Individual test files import from it to access Shopware-specific fixtures.'
    },
    {
      id: 'eq-46', moduleId: 'module-4',
      question: 'What environment variable sets the base URL for Playwright tests?',
      options: ['BASE_URL', 'TEST_URL', 'SHOPWARE_URL', 'APP_URL'],
      correct: 3, explanation: '`APP_URL` in `.env` (copied from `.env.dist`) sets the base URL used by Playwright to navigate to the Shopware storefront.'
    },
    {
      id: 'eq-47', moduleId: 'module-4',
      question: 'What does `TestDataService.createBasicProduct()` provide in a Playwright test?',
      options: ['A mock product rendered in the browser', 'A product created via the Shopware API for use in the test', 'A static product fixture from a JSON file', 'A Playwright page object for the product detail page'],
      correct: 1, explanation: '`TestDataService` creates real test data via the Shopware API, so the test operates against actual database records.'
    },
    {
      id: 'eq-48', moduleId: 'module-4',
      question: 'What Twig filter would you use to safely output HTML content from user input?',
      options: ['|raw', '|escape', '|striptags', '|sw_sanitize'],
      correct: 3, explanation: '`|sw_sanitize` strips dangerous HTML (scripts, event handlers) while keeping safe tags. `|raw` is unsafe as it outputs HTML without sanitization.'
    },
    {
      id: 'eq-49', moduleId: 'module-4',
      question: 'Which of the following is NOT one of the 7 folders in the 7-1 SCSS pattern?',
      options: ['components/', 'vendors/', 'modules/', 'layout/'],
      correct: 2, explanation: '`modules/` is not part of the 7-1 pattern. The 7 folders are: base, components, layout, pages, themes, utils, vendors.'
    },
    {
      id: 'eq-50', moduleId: 'module-4',
      question: 'When running Playwright tests in CI, setting `workers: 1` ensures what?',
      options: ['Speeds up execution by parallelizing tests', 'Runs only the first test file', 'Tests run sequentially to avoid resource conflicts', 'Disables screenshot capture'],
      correct: 2, explanation: 'In CI, `workers: 1` runs tests one at a time to prevent resource conflicts and race conditions between parallel tests.'
    }
  ]

}; // end APP_DATA
