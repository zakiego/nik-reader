# NIK Reader and Generator

This project is a web-based tool for reading and generating NIK (Nomor Induk Kependudukan) details. It provides functionalities to input a NIK, read the details, and generate a new NIK.

## Features

- **Read NIK**: Input a NIK to get detailed information including province, district, sub-district, gender, date of birth, and unique ID.
- **Generate NIK**: Generate a new valid NIK.

## Development

1. Clone the repository:

```bash
https://github.com/zakiego/nik-reader.git
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open the browser and navigate to `http://localhost:3000`.

## Deployment

Deployed to [Cloudflare Pages](https://nik-reader.pages.dev) via [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages). Every server route runs on the Workers runtime.

```bash
pnpm pages:build     # build the Pages worker
pnpm pages:preview   # run it locally on workerd
pnpm pages:deploy    # deploy
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
