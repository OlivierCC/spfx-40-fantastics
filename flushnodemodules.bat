mkdir empty_dir
robocopy empty_dir node_modules /s /mir
rmdir empty_dir
rmdir node_modules