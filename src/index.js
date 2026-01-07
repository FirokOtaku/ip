// noinspection JSUnresolvedLibraryURL

import { version } from '../package.json'

/**
 * @return {Response}
 * */
function pathFavicon()
{
	return new Response(
		`<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
  <rect x="16" y="16" width="8" height="32" fill="#108b96"/>
  <rect x="32" y="16" width="8" height="32" fill="#108b96"/>
  <path d="M 40 36 A 8 8 0 1 0 40 20" stroke="#108b96" stroke-width="8" fill="transparent"/>
</svg>`,
		{
			headers: {
				'Content-Type': 'image/svg+xml',
				'Access-Control-Allow-Origin': '*',
			},
		},
	)
}
/**
 * @param {Request} request
 * @param {URL} url
 * @return {Response}
 * */
function pathRoot(request, url)
{
	const cf = request.cf
	const headers = request.headers
	let {
		longitude, latitude, country, continent, timezone,
		region, city, regionCode, asOrganization,
	} = cf
	longitude = longitude ?? ''
	latitude = latitude ?? ''
	country = country ?? ''
	continent = continent ?? ''
	timezone = timezone ?? ''
	region = region ?? ''
	city = city ?? ''
	regionCode = regionCode ?? ''
	asOrganization = asOrganization ?? ''

	const ua = headers.get('user-agent') ?? ''
	const ip = headers.get('CF-Connecting-IP') ?? ''
	const now = new Date()
	const timestamp = now.getTime()
	const timestampStr = now.toISOString()

	const format = url.searchParams.get('format')
	switch (format)
	{
		case 'json': return new Response(
			JSON.stringify({
				'ip': ip,
				'continent': continent,
				'countries_or_regions': country,
				'secondary_region': region,
				'secondary_region_code': regionCode,
				'city': city,
				'longitude': longitude,
				'latitude': latitude,
				'timezone': timezone,
				'isp': asOrganization,
				'ua': ua,
				'timestamp': timestamp,
				'timestamp_str': timestampStr,
				'service_version': version,
			}),
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				}
			}
		)

		case 'html':
		default: return new Response(
			`<!doctype html>
<html lang='zh'>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>IP echo service</title>
<link rel="icon" href="favicon.svg" type='text/svg xml' sizes='64x64' />
<link rel="stylesheet" href="https://unpkg.com/marx-css/css/marx.min.css">
<style>
table { margin: 0; width: 100% }
td:first-child { font-weight: bold; width: 160px }
td:last-child:empty:after { content: 'unknown'; color: red }
a, a:visited, a > code, a:visited > code { color: #3b82f6 }
</style>
</head>
<body>
<main>
<table>
<tr><td>IP</td><td>${ip}</td></tr>
<tr><td>大陆</td><td>${continent}</td></tr>
<tr><td>国家/地区</td><td>${country}</td></tr>
<tr><td>省份/区域</td><td>${region}</td></tr>
<tr><td>省份/区域代码</td><td>${regionCode}</td></tr>
<tr><td>城市</td><td>${city}</td></tr>
<tr><td>经度</td><td>${longitude}</td></tr>
<tr><td>纬度</td><td>${latitude}</td></tr>
<tr><td>时区</td><td>${timezone}</td></tr>
<tr><td>ISP</td><td>${asOrganization}</td></tr>
<tr><td>UA</td><td>${ua}</td></tr>
<tr><td>响应时间</td><td>${timestamp}</td></tr>
<tr><td></td><td>${timestampStr}</td></tr>
</table>
<blockquote>
IP echo service v${version} by <a target='_blank' href='https://github.com/FirokOtaku/'>Firok</a> <br>
based on <a target='_blank' href='https://developers.cloudflare.com/workers/'>Cloudflare Workers</a>. <br>
<br>
If JSON format is needed, use parameter <a href='/?format=json'><code>?format=json</code></a> <br>
<br>
open source on <a target='_blank' href='https://github.com/FirokOtaku/ip'>GitHub</a> <br>
under Mulan PSL v2 license. <br>
<br>
Styled with <a target='_blank' href='https://mblode.github.io/marx/'>Marx.css</a>
</blockquote>
</main>
</body>
</html>
`,
			{
				headers: {
					'Content-Type': 'text/html',
					'Access-Control-Allow-Origin': '*',
				}
			}
		)
	}
}

/**
 * @param {URL} url
 * @return {Response}
 * */
function pathRedirect(url)
{
	const target = url.protocol + '//' + url.host + '/'
	return Response.redirect(target, 301)
}

export default {
	/**
	 * @param {Request} request
	 * @param {any} env
	 * @param {any} ctx
	 * @return {Promise<Response>}
	 * */
	async fetch(request, env, ctx)
	{
		const url = new URL(request.url)
		switch (url.pathname)
		{
			case '/favicon.svg': return pathFavicon()
			case '/': return pathRoot(request, url)
			default: return pathRedirect(url)
		}
	},
};
