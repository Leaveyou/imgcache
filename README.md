# ImgCache - Homework

Image resize microservice. Learning nodejs and typescript.

## Features:

* 3 resize strategies: [`COVER` | `FIT` | `STRETCH`] Which respectively try to `cover` the given dimensions, `fit` 
into them, or `stretch` to match the aspect ratio.
* Support for multiple edge cases in input files. Examples bundled.
    * special characters: `cu spații & diacritice.jpg`
    * multiple formats, even transparency: `fsm.png`. Can technically support all formats supported by 
    [graphicsmagick](http://www.graphicsmagick.org/formats.html) if not for extension whitelist.
    * Extension whitelist
    * subfolders in source directory: `subfolder/imagine.jpg`
    * Invalidate cache on original file `mtime` changes
    * both `.jpeg` and `.jpg` extensions supported
* docker setup
* Resized file caching
* Http cache headers also offered by framework.
* Stateless operation. Multiple instances can work with the same sources and cache directories.
* Resized files are cached based on actual size, not requested size. This makes it that resizing 
using `FIT` or `COVER` strategies which preserve aspect ratio don't present the chance of ignoring 
an available cached dimension.
    
### It doesn't do: 

* Automatic cache eviction, but the CacheGateway interface setter signature does contain `ttl` 
parameter for implementing it on a separate gateway.

### // Todo: `(if you work at Ownzones and see this, I might have failed)`

* automated tests
* stats page and monitoring
* simple rate limiting
* rate limit for cache fails might also be feasible

## Security

The application has limited attack vectors. Besides potential exploits found in the expressJs framework 
the application offers as little surface area for potential hackers as possible:
* Input parameters: 
    * `/static/* files` - must match existing files which MUST be inside the `./static` folder
    * `size` - parameter is checked for 
        * length
        * structure (regex)
        * content - MAX size is configurable
    * `If-None-Match` http parameter - used internally by expressJs for etag matching
* As little info to attackers as possible. Errors shown to users contain no sensitive data.
* Input files are read-only from the application's perspective

Additionally some additional protections can be put in place to mitigate DOS risks based on client behavior.
    * Same ip should not ignore `cache-control: max-age` headers excessively if set.
    * Same ip should not ask for an absurd number of different image sizes, eg: 100x100, 100x101, 100x102. etc. 
    
## Operation

The application leverages expressJs middleware-centered architecture

URLs look like `http://localhost:8888/static/bh.jpg?size=2000x2000`

The `/static` part triggers the image resizing controller
    
The `size` parameter must obey configuration `MAX_SIZE` value, currently `{width: 9999, height: 9999}`

Images are NOT enlarged no mater what. If asking for a resolution larger than the original, the original is served instead.

Building on the behavior above, not specifying the size parameter is operationally equivalent to asking for size 9999x9999

Images are looked up in the folder specified by the `STATIC_PATH` env variable and cached under the folder specified by the `CACHE_PATH` env variable

Images are resized first (if needed) and only afterwards is the buffer written to the cache.

The current (basic) implementation of a cache gateway saves files under a hierarchy similar to the source files.

|Source|Cache|
|---|---|
|`/webroot/static/test.jpg`|`/webroot/cache/test.jpg/100x100.jpg`|
|`/webroot/static/test.jpeg`|`/webroot/cache/test.jpeg/100x100.jpeg`|
|`/webroot/static/subfolder/test.png`|`/webroot/cache/subfolder/test.png/100x100.png`|

The arrangement above makes it so that cache can be deleted on a per-file basis. 

## Basic usage

### Step 1 - Build the image

Run from repository directory:
~~~ bash
sudo docker build -t homework .
~~~

### Step 2 - Run image
~~~ bash
sudo docker run \
    --publish 8888:80 \
    --env CACHE_PATH=/var/www/imgcache/cache \
    --env STATIC_PATH=/var/www/imgcache/static \
    --env RESIZE_STRATEGY=FIT \
    --env NODE_ENV=production \
    --env PORT=80 \
    --volume `pwd`/static:/var/www/imgcache/static \
    homework
~~~

### Step 3 - Check results

Open a web browser, curl or wget the application:
http://localhost:8888/static/bh.jpg?size=2000x2000
