<h1 align="center">Notables</h1>
<p align="center">Notables is a highly anticipated platform for writing notes, primarily focused on literature and technical documents.</p>

## Features
- **Markdown Editor**: Write notes in markdown format.
- **Syntax Highlighting**: Supports syntax highlighting for code snippets.
- **Dark Mode**: Toggle between light and dark mode.
- **Export Notes**: Export notes in markdown format.
- **LaTeX Support**: Write mathematical equations using LaTeX.
- **Search Notes**: Search notes by title, content or **tags**.
- **Tags**: Add tags to notes for better organization.

## Tech Stack
- **Frontend**: Using Next.js(React), React Query, Shadcn UI, Tailwind CSS.
- **Backend**: Using Next.js Server Actions, Postgres, Better-Auth, Drizzle.
- **Deployment**: Vercel, Coolify.

## Installation & Contributing

1) Clone the repository from the GitHub
2) Supply required environment variables through `.env` file:
  ```properties
  # Or contact your project developer for credentials.
  DATABASE_URL=<postgres database url>
  BETTER_AUTH_SECRET=<better auth secret>
  BETTER_AUTH_URL=http://localhost:3000
  GITHUB_CLIENT_ID=<GitHub application client id>
  GITHUB_CLIENT_SECRET=<GitHub application client secret>
  GOOGLE_CLIENT_ID=<GitHub application client id>
  GOOGLE_CLIENT_SECRET=<GitHub application client secret>
  CAPTCHA_SECRET_KEY=<Cloudflare Turnstile captcha secret key>
  CAPTCHA_SITE_KEY=<Cloudflare Turnstile captcha site key>
  LOGFLARE_API_KEY=<Logflare API key>
  LOGFLARE_SOURCE_TOKEN=<Logflare source token>
  ```
3) Use Bun to run/build the application: `bun run dev`, `bun run build`

### Contributing

We welcome any contributions to the project, if you think you have an idea, bug
or feature you would like to submit, feel free to create an issue, which will be
then after consideration submitted to our system. Creating PR directly **does not** gurrantee that it will be merged.

## Developers

<table>
<tr>
<th>Image</th>
<th>Name</th>
<th>Contact address</th>
</tr>
<tr>
<td><img width=40 src="https://github.com/koblizekXD.png?size=40"></td>
<td><strong>AA55h</strong> - lead developer</td>
<td><strong>prokupekj.07@spst.eu</strong></td>
</tr>
<tr>
<td><img width=40 src="https://github.com/vojtiikxdd.png?size=40"></td>
<td><strong>vojtiikxdd</strong></td>
<td><strong>razimav.06@spst.eu</strong></td>
</tr>
<tr>
<td><img width=40 src="https://github.com/KebabObama.png?size=40"></td>
<td><strong>KebabObama</strong></td>
<td><strong>chybal.06@spst.eu</strong></td>
</tr>
</table>

## Licensing

Given this is a closed-sourced proprietary software, no license is present.
