fx_version 'bodacious'
game 'gta5'

author 'desu'

client_scripts {
	'@vrp/lib/utils.lua',
	'hansolo/*.lua'
}

ui_page 'nui/darkside.html'

files {
	'nui/*.html',
	'nui/*.css',
	'nui/*.js',
	'nui/**/*.png',
	'nui/**/*.ttf'
}

provides {
	'mumble-voip',
    -- why does it use so many different names
    'tokovoip',
    'toko-voip',
    'tokovoip_script'
}