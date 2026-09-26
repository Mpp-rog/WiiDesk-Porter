var def_config = {
    musicVol: 0.5,
    sfxVol: 0.2,
}

if (typeof(Storage) !== "undefined") {
    if (!localStorage.getItem('wiidesk-settings') && localStorage.getItem('wiidesk-settings')) {
        localStorage.setItem('wiidesk-settings', localStorage.getItem('wiidesk-settings'));
    }
    if (!localStorage.getItem('wiidesk-channels') && localStorage.getItem('wiidesk-channels')) {
        localStorage.setItem('wiidesk-channels', localStorage.getItem('wiidesk-channels'));
    }
}

if (typeof(Storage) !== "undefined") {
    if (!localStorage.getItem('wiidesk-settings')) {

        localStorage.setItem("wiidesk-settings", JSON.stringify(def_config));

        location.reload();
    }
} else {
    alert('Local Storage is not support or disabled -- settings will not work!')
}

var userConfig = JSON.parse(localStorage.getItem('wiidesk-settings'));
console.log("user config:", userConfig);

var def_channels = [
    {
        id: 'disc',
        title: 'Disc Channel',
        assets: 'assets/channels/',
        channelart: 'channelart/',
        disc: true,
        target: 'http://localhost:8888/launch?path=' + encodeURIComponent('explorer.exe C:\\'),
        isAppLauncher: true
    },
    {
        id: 'mii',
        title: 'Mii Channel',
        assets: 'assets/channels/',
        channelart: 'channelart/'
    },
    {
        id: 'photo',
        title: 'Photo Channel',
        assets: 'assets/channels/',
        channelart: 'channelart/'
    },
    {
        id: 'shop',
        title: 'Wii Shop Channel',
        assets: 'assets/channels/',
        channelart: 'channelart/'
    },
    {
        id: 'news',
        title: 'News Channel',
        assets: 'assets/channels/',
        channelart: 'channelart/'
    }
]

var storedChannels = localStorage.getItem('wiidesk-channels');
if (!storedChannels) {
    console.log('No channels found, loading defaults...');
    localStorage.setItem("wiidesk-channels", JSON.stringify(def_channels));
} else {

    var existingChannels = JSON.parse(storedChannels);
    var existingIds = existingChannels.map(function (ch) { return ch.id; });
    var healedChannels = existingChannels.filter(function (ch) {
        return ch.id !== 'bottomgear' && ch.id !== 'onliine';
    });
    def_channels.forEach(function (defCh) {
        if (existingIds.indexOf(defCh.id) === -1) {
            healedChannels.push(defCh);
        }
    });
    if (healedChannels.length !== existingChannels.length) {
        console.log('Restoring missing channels:', healedChannels.length - existingChannels.length);
        localStorage.setItem("wiidesk-channels", JSON.stringify(healedChannels));
    }
}
var userChannels = JSON.parse(localStorage.getItem('wiidesk-channels'));
console.log("user channels: ", userChannels);

function resetConfig(confirm) {
    if (confirm == true) {

        localStorage.setItem("wiidesk-settings", JSON.stringify(def_config));
        userConfig = JSON.parse(localStorage.getItem('wiidesk-settings'));
        console.log("user config reset!:", userConfig);
    } else {
        console.error("loadDefaultConfig: MAKE SURE YOU'D LIKE TO DO THIS BY USING \"loadDefaultConfig(true)\". THERE'S NO TURNING BACK!!")
    }
}

function resetChannels(confirm) {
    if (confirm == true) {

        localStorage.setItem("wiidesk-channels", JSON.stringify(def_channels));
        userChannels = JSON.parse(localStorage.getItem('wiidesk-channels'));
        console.log("user channels reset! (reload page to see):", userChannels);
    } else {
        console.error("loadDefaultChannels: MAKE SURE YOU'D LIKE TO DO THIS BY ADDING \"true\" IN THE FUNCTION. THERE'S NO TURNING BACK!!")
    }
}