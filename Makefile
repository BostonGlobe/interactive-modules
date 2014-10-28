R:

	Rscript -e "rmarkdown::render('data/interactive-modules.Rmd')"
	open data/interactive-modules.html

R_deploy:

	cp data/interactive-modules.html /Volumes/www_html/multimedia/graphics/projectFiles/Rmd/
	rsync -rv data/interactive-modules_files /Volumes/www_html/multimedia/graphics/projectFiles/Rmd
	open http://private.boston.com/multimedia/graphics/projectFiles/Rmd/interactive-modules.html