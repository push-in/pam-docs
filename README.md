<div align="center">

# PAM Documentation

### The complete technical record for the PHP application platform.

**Server runtime, Laravel, native Android and iOS, desktop applications,
packages, architecture, security, performance, production operations, and
every public component contract—documented in one place.**

[![Documentation](https://img.shields.io/badge/read-push--in.github.io-5b50d6?style=flat-square)](https://push-in.github.io/pam-docs/introduction/)
[![Deploy](https://img.shields.io/github/actions/workflow/status/push-in/pam-docs/pages.yml?branch=main&style=flat-square&label=Pages)](https://github.com/push-in/pam-docs/actions/workflows/pages.yml)
![Astro](https://img.shields.io/badge/Astro-Starlight-BC52EE?style=flat-square&logo=astro&logoColor=white)

**[Read the docs](https://push-in.github.io/pam-docs/introduction/) ·
[Server runtime](https://push-in.github.io/pam-docs/runtime/how-pam-works/) ·
[Laravel](https://push-in.github.io/pam-docs/laravel/overview/) ·
[Native mobile](https://push-in.github.io/pam-docs/native/overview/) ·
[Desktop](https://push-in.github.io/pam-docs/desktop/overview/) ·
[Contributing](https://push-in.github.io/pam-docs/community/contributing/)**

</div>

---

PAM itself is the small persistent PHP runtime and process boundary. HTTP,
Laravel, Native, Desktop, UI and integrations are independent Composer
products built on top of that runtime—like packages around Node.js.

## Source repositories

- [PAM runtime](https://github.com/push-in/pam)
- [PAM Native core](https://github.com/push-in/pam-native)
- [PAM Native UI](https://github.com/push-in/pam-native-ui)
- [PAM Native Nitro](https://github.com/push-in/pam-native-nitro)
- [PAM Desktop](https://github.com/push-in/pam-desktop)
- [Laravel on PAM](https://github.com/push-in/pam-laravel)

Install PAM once, then use Composer through its bundled PHP runtime:

```bash
curl -fsSL https://push-in.github.io/pam/install.sh | sh
pam doctor
pam composer require pushinbr/pam-native-auth
```

`pam composer` is the canonical ecosystem workflow. Packages use the normal
`composer.json`, `composer.lock`, Packagist metadata and `vendor/bin` tools.

This repository explains that platform without hiding the hard parts. The
documentation records public APIs, architectural ownership, lifecycle,
protocol limits, security boundaries, performance evidence, compatibility
status, release provenance, and known limitations. Ambition is welcome here;
unsupported claims are not.

## Explore the platform

| Area | What it covers |
| --- | --- |
| [Introduction](https://push-in.github.io/pam-docs/introduction/) | Why PAM exists and how the ecosystem fits together |
| [Server runtime](https://push-in.github.io/pam-docs/runtime/how-pam-works/) | Persistent PHP, Tokio, Fibers, HTTP, async I/O and production |
| [Laravel](https://push-in.github.io/pam-docs/laravel/overview/) | Long-lived Laravel, isolation, workers, observability and deployment |
| [PAM Native](https://push-in.github.io/pam-docs/native/overview/) | Android/iOS, components, lifecycle, global store, media and native APIs |
| [PAM Desktop](https://push-in.github.io/pam-docs/desktop/overview/) | Servo host, capabilities, plugins, security and distribution |
| [Packages](https://push-in.github.io/pam-docs/packages/overview/) | First-party Composer APIs and interoperability |

## Local development

```bash
npm install
npm run dev
```

Run the complete quality gate before publishing:

```bash
npm run validate
```

Validation checks Astro content and types, builds the static site, verifies
internal links, and runs the accessibility contract.

## Documentation standard

Every significant capability should include:

- a clear user outcome;
- a copyable example;
- the architecture or ownership boundary that matters;
- security and performance constraints;
- platform or version limitations;
- links from the correct navigation section; and
- executable evidence where the repository provides it.

See the
[documentation contribution guide](https://push-in.github.io/pam-docs/community/documentation/)
for the complete publishing contract.
