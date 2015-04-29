SHELL   = /bin/bash
PREFIX := /usr/share/deepin-manual

all: dist


dependencies: nodejs
	# Installing node modules and transpile scripts
	echo "Installing dependencies"
	if [ -d "/opt/libjs-dmanual-dev" ]; then \
		ln -sf /opt/libjs-dmanual-dev/node_modules ./PageRoot/node_modules; \
	else \
		cd PageRoot && PATH="$(shell pwd)/symdir/:$$PATH" npm --production install; \
	fi

dist: dependencies sass
	echo "Transpiling"
	mkdir -p PageRoot/www/scripts
	cd PageRoot && \
	    PATH="$(shell pwd)/symdir/:$$PATH" node --harmony ./node_modules/gulp/bin/gulp.js dist

	# Remove unminified bundle.js
	rm PageRoot/www/scripts/bundle.js

	echo "Copying icon"
	cp DMan/DManual.svg PageRoot/www/favicon.svg

nodejs:
	# Debian-based distros use nonstandard node executable name
	mkdir -p symdir
	ln -sf /usr/bin/nodejs ./symdir/node

install:
	mkdir -p $(DESTDIR)$(PREFIX)/{PageRoot,DMan}
	cp -r PageRoot/{www,plugins,manifest.json} $(DESTDIR)$(PREFIX)/PageRoot/
	cp -r DMan/* $(DESTDIR)$(PREFIX)/DMan/
	rm -r $(DESTDIR)$(PREFIX)/PageRoot/www/{jssrc,scss}
	find $(DESTDIR)$(PREFIX) -name "__pycache__" -print0 | xargs -0 rm -rf

	# remove unused files for dae
	rm -rf $(DESTDIR)$(PREFIX)/DMan/qml
	rm -rf $(DESTDIR)$(PREFIX)/DMan/tests
	rm -rf $(DESTDIR)$(PREFIX)/DMan/{main.py,main2.py,QmlResizable.py,view.py,webview.py}
	mv $(DESTDIR)$(PREFIX)/DMan/main_dae.py $(DESTDIR)$(PREFIX)/DMan/main.py
	chmod +x $(DESTDIR)$(PREFIX)/DMan/main.py

	# Atom-shell script
	# cp {main.js,package.json} $(DESTDIR)$(PREFIX)/
	# chmod +x $(DESTDIR)$(PREFIX)/main.js

	# install dman in /usr/bin
	install -d $(DESTDIR)/usr/bin
	ln -s $(PREFIX)/DMan/main.py $(DESTDIR)/usr/bin/dman
	python3 -OO -m compileall -q $(DESTDIR)$(PREFIX)/DMan

	# copy dman for dman
	mkdir -p $(DESTDIR)/usr/share/dman
	cp -r manual $(DESTDIR)/usr/share/dman/dman

	# Copy icons
	mkdir -p $(DESTDIR)/usr/share/icons/hicolor/scalable/apps
	cp DMan/DManual.svg $(DESTDIR)/usr/share/icons/hicolor/scalable/apps/deepin-manual.svg

sass:
	mkdir -p PageRoot/www/style
	sass --style compressed --unix-newlines PageRoot/www/scss/index.scss PageRoot/www/style/index.css
	sass --style compressed --unix-newlines PageRoot/www/scss/content.scss PageRoot/www/style/content.css
	sass --style compressed --unix-newlines PageRoot/www/scss/reset.scss PageRoot/www/style/reset.css

clean:
	rm -rf symdir/
	rm -rf debian/deepin-manual
	rm -rf debian/files
	rm -rf debian/*.debhelper
	rm -rf debian/*.debhelper.log
	rm -rf debian/*.substvars

deepclean: clean
	rm -rf PageRoot/www/{style,scripts,nls,favicon.svg}
	rm -rf PageRoot/node_modules

.PHONY: all dist dependencies nodejs sass install clean deepclean
