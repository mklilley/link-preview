# link-preview

This is a NodeJS wrapper around the npm library [link-preview-generator](https://github.com/AndrejGajdos/link-preview-generator) created by [AndrejGajdos](https://github.com/AndrejGajdos) - you can read more about how the library works on [Andrej's blog](https://andrejgajdos.com/how-to-create-a-link-preview/).

The server expects a post request with a JSON body in the form:

```
{"url" : "https://example.com"}
```

It returns json with the link preview data in the form:

```
{
title: "Example page",
description "This is an example page",
image: "https://example.com/img/image.png",
domain: "example.com"

}
```

Note, this is a simple http server. If you want it to respond to https requests, then you'll either need to modify the server code, see e.g. [How to create an https server?](https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/), or put the node server behind a reverse proxy, see e.g. [NGINX Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/).

Second note. For running on Linux, you might encounter some errors associated with puppetteer. I found the links below helpful:

- [How to fix puppetteer error while loading shared libraries](https://techoverflow.net/2018/06/05/how-to-fix-puppetteer-error-while-loading-shared-libraries-libx11-xcb-so-1-cannot-open-shared-object-file-no-such-file-or-directory/)
- [Setting Up Chrome Linux Sandbox](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#setting-up-chrome-linux-sandbox)
