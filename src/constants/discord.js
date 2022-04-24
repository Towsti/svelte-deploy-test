// import { PublicGoogleSheetsParser } from 'public-google-sheets-parser';
import { str } from "ajv";
import PublicGoogleSheetsParser from "../spreadsheet";

// export default {
//     data () {
//       return {
//         items: [],
//       }
//     },
//     computed: {
//       parser () {
//         return new PublicGoogleSheetsParser()
//       },
//     },
//     methods: {
//       async getItems (spreadsheetId) {
//         this.items = await this.parser.parse(spreadsheetId)
//       },
//     },
// }

export const avatarURL = 'https://cdn.discordapp.com/avatars/689197754584399963/51fc3581cac941e4adbafd41e7ae2ec3.webp?size=80';
export const username = 'PvM Encyclopedia';

export let channels = {};
export let users = {'108682527304060928': 'FriggityFrank'};
export let roles = {};

export let pvmeSpreadsheet = {}; 

export async function populateConstants() {
    // await new Promise(r => setTimeout(r, 5000));
    await setChannels();
    await setRoles();
    // await setUsers();
    await setPvmeSpreadsheet();
}

async function setPvmeSpreadsheet() {
    const spreadsheetID = '1OGM9MBUG2bQVbHxlm86Xfs60soFcjINSOrPv1WL3Vgw';
    pvmeSpreadsheet = {
        // Mastery: getColRowLUT(await googleSheetsRequest(spreadsheetID, 'Mastery')),
        // Prices: getColRowLUT(await googleSheetsRequest(spreadsheetID, 'Prices')),
        // Consumables: getColRowLUT(await googleSheetsRequest(spreadsheetID, 'Consumables')),
        // Unlocks: getColRowLUT(await googleSheetsRequest(spreadsheetID, 'Unlocks')),
        // Miscellaneous: getColRowLUT(await googleSheetsRequest(spreadsheetID, 'Miscellaneous')),
        // Perks: getColRowLUT(await googleSheetsRequest(spreadsheetID, 'Perks')),
        Slayer: getColRowLUT(await googleSheetsRequest(spreadsheetID, 'Slayer')),
        // Bosses: getColRowLUT(await googleSheetsRequest(spreadsheetID, 'Bosses'))
    }
    // const debug = '10WDbAPAY7Xl5DT36VuMheTPTTpqx9x0C5sDCnh4BGps';
    // const parsedJSON = await googleSheetsRequest(debug, 'Sheet1');
    // console.log(JSON.stringify(parsedJSON));
    // const rowColLUT = getColRowLUT(parsedJSON)
    // console.log(JSON.stringify(rowColLUT))
    console.log(pvmeSpreadsheet);
}

function getColRowLUT(parsedJSON) {
    /*
    convert: {"version":"0.6","reqId":"0","status":"ok","sig":"779687672","table":{"cols":[{"id":"A","label":"a","type":"number","pattern":"General"},{"id":"B","label":"b","type":"number","pattern":"General"},{"id":"C","label":"c","type":"number","pattern":"General"}],"rows":[{"c":[{"v":1,"f":"1"},{"v":2,"f":"2"},{"v":3,"f":"3"}]},{"c":[{"v":4,"f":"4"},{"v":5,"f":"5"},{"v":6,"f":"6"}]},{"c":[{"v":7,"f":"7"},{"v":8,"f":"8"},{"v":9,"f":"9"}]}],"parsedNumHeaders":1}}
    to: {"A":{"1":"1","2":"4","3":"7"},"B":{"1":"2","2":"5","3":"8"},"C":{"1":"3","2":"6","3":"9"}}
    */
    const table = parsedJSON.table;
    console.log(parsedJSON);
    const sheetData = {};
    let colIndex = 0;
    for (const col of table.cols) {
        // const rows = table.rows[index];
        // console.log(rows);
        const cells = {}
        let rowIndex = 1;
        for (const row of table.rows) {
            const cell = row.c[colIndex];
            
            if (cell == null || cell.v == null) 
                cells[rowIndex] = null;
            else if (cell.f)
                cells[rowIndex] = cell.f;
            else
                cells[rowIndex] = cell.v;
            rowIndex++;
        }
        sheetData[col.id] = cells;
        colIndex++;
    }
    return sheetData;
}

async function googleSheetsRequest(id, sheet=null) {
    let url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?`;
    if (sheet)
        url = url.concat(`sheet=${sheet}`);
    const res = await fetch(url, {
        method: 'GET'
    });

    if (res.ok) {
        const spreadsheetResponse = await res.text();
        return JSON.parse(spreadsheetResponse.split('\n')[1].replace(/google.visualization.Query.setResponse\(|\);/g, ''));
    } else {
        throw new Error(await res.text());
    }
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
    channels = {};
    for (const channel of channelsJSON) {
        channels[channel.id] = channel.name;
    }
}

async function setRoles() {
    const rolesJSON = await rawGithubGetRequest('https://raw.githubusercontent.com/pvme/pvme-settings/master/roles.json');
    roles = {};
    for (const role of rolesJSON) {
        roles[role.id] = role.name;
    }
}

async function setUsers(rolesJSON) {
    roles = {};
    for (const role of rolesJSON) {
        roles[role.id] = role.name;
    }
}


