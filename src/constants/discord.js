export const avatarURL = 'https://cdn.discordapp.com/avatars/689197754584399963/51fc3581cac941e4adbafd41e7ae2ec3.webp?size=80';
export const username = 'PvM Encyclopedia';

export let channels = {};
export let users = {'108682527304060928': 'FriggityFrank'};
export let roles = {};

export let pvmeSpreadsheet = {};

export let channelsFormat = {};
export let usersFormat = {};
export let rolesFormat = {};
export let emojisFormat = {};

export async function populateConstants() {
    // await new Promise(r => setTimeout(r, 5000));
    await setChannels();
    await setRoles();
    // await setUsers();
    await setPvmeSpreadsheet();
    await setEmojis();
}

async function setPvmeSpreadsheet() {
    pvmeSpreadsheet = await rawGithubGetRequest('https://raw.githubusercontent.com/Towsti/pvme-settings/master/pvme_spreadsheet.json');
}

async function rawGithubGetRequest(url) {
    const res = await fetch(url, {
        method: 'GET'
    });
    
    if (res.ok) {
        return await res.json();
    } else {
        throw new Error(await res.text());
    }
}

async function setChannels() {
    const channelsJSON = await rawGithubGetRequest('https://raw.githubusercontent.com/pvme/pvme-settings/master/channels.json');
    channels = channelsFormat = {};
    for (const channel of channelsJSON) {
        channels[channel.id] = channel.name;
        channelsFormat[channel.name.toLowerCase()] = channel.id;
    }
}

async function setRoles() {
    const rolesJSON = await rawGithubGetRequest('https://raw.githubusercontent.com/pvme/pvme-settings/master/roles.json');
    roles = rolesFormat = {};
    for (const role of rolesJSON) {
        roles[role.id] = role.name;
        rolesFormat[role.name.toLowerCase()] = role.id;
    }
}

// async function setUsers() {
//     users = {};
//     for (const user of rolesJSON) {
//         roles[role.id] = role.name;
//     }
// }

async function setEmojis() {
    const emojisJSON = await rawGithubGetRequest('https://raw.githubusercontent.com/pvme/rotation-builder/main/settings.json');
    emojisFormat = {};
    for (const [emoji, aliases] of Object.entries(emojisJSON)) {
        for (const alias of aliases) {
            emojisFormat[alias.toLowerCase()] = emoji;
        }
    }
}
