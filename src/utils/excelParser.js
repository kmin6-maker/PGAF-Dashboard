import * as XLSX from 'xlsx';

// SN attendee emails - 405 unique from SN 1-6
const SN_EMAILS = new Set([
  'maria.taricco@gmail.com','swoods@pgalums.com','aliyu@ehfaaz.ae','khadijamian6@gmail.com',
  'stpharena@gmail.com','ellen@brandnovus.com','christiandum@gmail.com','luci.sheehan@outlook.com',
  'mszempruch@outlook.com','michelle@bebrownbrave.com','go.nae.go@gmail.com',
  'info@jowija.nl','sreemoyee.ghoshd@gmail.com','dirk@thinkcmb.com','roisinjane@btinternet.com',
  'anguria.dorcas@gmail.com','viviramesh@winningstrategy.in','raytopme@gmail.com',
  'sophiat88.st@gmail.com','lennert.acke@gmail.com','arun@pabari.net',
  'donna@crossroadconsultinggroup.com','emailmaggie@gmail.com','soma.2104@gmail.com',
  'janet.l.butler55@gmail.com','sergiomirensky@hotmail.com','tedelong.te@gmail.com',
  'jbisbee65@gmail.com','anmalves52@virgilio.it','colleen@agelesscareers.com',
  'julie.lumgair@gmail.com','akinpeluakinkunle22@gmail.com','ute.hagen@gmail.com',
  'gallgood@worldvision.org','james@jblackadvisoryllc.com','mariannei5611@gmail.com',
  'mbeckhamcorbin@gmail.com','ify_okafor1@yahoo.com','tan.cathy@gmail.com',
  'gulpinarhb@outlook.com','aftab@oxobrands.com','ayushwc@gmail.com',
  'kristina.i.kaneva@gmail.com','elena.etcharren@gmail.com','juanmarioamador@gmail.com',
  'adasellquilter@gmail.com','mariaelanacerro@gmail.com','shamrockrek@aol.com',
  'info@brightfutureshub.net','waliidmohamed33@gmail.com','hsimmons4@gmail.com',
  'irenakojova@hotmail.com','david@davidbernardino.com','carroll.kd@gmail.com',
  'juan@gonzasearch.com','mejias1@hotmail.com','romaincharles@luckycart.com',
  'viviramesh@gmail.com','debrajillbass@yahoo.com','paige@mavensandmoguls.com',
  'cynthia@828insights.com','dianehoffm@yahoo.com','docchicharo@yahoo.com',
  'paul.anfinsen@gmail.com','pem5319@gmail.com','thomaszanin9@gmail.com',
  'lori_yuhas@yahoo.com','fedorovanv@gmail.com','shilpa.marodia@gmail.com',
  'ftylman@gmail.com','nxfx@mac.com','adrijana.daragon@gmail.com',
  'radziszewska.a.e@gmail.com','aymanahmed68@gmail.com','andre.stolz@budinno.com',
  'adeel@wecrunch.com','arthurbelkin5@gmail.com','betestlo@gmail.com',
  'cerar@management-counterparts.com','catherine.design365@gmail.com',
  'a1hmad_khan@yahoo.com','salwanf@yahoo.com','jacobqualls@outlook.com',
  'jan.wenda@gmail.com','lymjoshua@gmail.com','o.joshua@validproof.com',
  'mavillaso@yahoo.com','otwade@gmail.com','tasharandle1121@gmail.com',
  'szairi@viohalco.com','suenock99@gmail.com','timoteo.hung@gmail.com',
  'wendy310569@gmail.com','ecfreedman@gmail.com','gail@gailmartino.com',
  'nickmangiapane@yahoo.com','cherevko.vlad@gmail.com','matias@beon.la',
  'jmortigosa@gmail.com','rick@successmadetolast.com','skaufman24@gmail.com',
  'laurabates@brandverve.net','brandmaven8@gmail.com','ikpengwa.obinna@gmail.com',
  'kathringhk@gmail.com','schwarz.rafael@territory.group','vbatrice@gmail.com',
  'adkison.emily@gmail.com','eva.m.bedell@gmail.com','heike.dammel@icloud.com',
  'genicabre@hotmail.com','i.kournioti@gmail.com','jpeggyy@gmail.com',
  'juliefitzgerald21@gmail.com','ldretzka@gmail.com','moscato.tj@gmail.com',
  'tom@sellwithinsight.com','willyen@gmail.com','werner.domittner@gmail.com',
  'susie@stardomconsulting.com','tk@nextgensuccess.com','t.thomas@coremanagementservice.com',
  'pawel.malyska75@gmail.com','elnaggar.o@outlook.com','evrard.nina@gmail.com',
  'lopezbad@gmail.com','momaisahmed@hotmail.com','michael.shangkuan@gmail.com',
  'miguel.cruz@mbitalent.group','rafdeazua@gmail.com','raulmore0873@gmail.com',
  'juanricardoshelley@gmail.com','teran.rd1@gmail.com','huerta.rubs@gmail.com',
  'salmanusuf@hotmail.com','seda.stein@icloud.com','shurukelwarrak@gmail.com',
  'johannaheuren@hotmail.com','olajidesalako@gmail.com','jcmahajan@live.in',
  'javiercontrerasegea@gmail.com','jadler@adlersolutionsllc.com',
  'jesusdpineda@icloud.com','jose.guerra@l5source.com','pascualjcarlos@gmail.com',
  'julia@beardwood.com','kushala.silva@gmail.com','lauremurciano@gmail.com',
  'lisabkent@gmail.com','carlagoffstein@gmail.com','claricetaylor7@gmail.com',
  'cvsimpson@googlemail.com','darrel@thebranchoutgroup.com','mdarst@protonmail.com',
  'davematthew22@gmail.com','cjchappell@mac.com','katyatalent@gmail.com',
  'pierrelias@gmail.com','vanolden.q@gmail.com','abby@strategic-choices.com',
  'annamlyn@gmail.com','as_megevand@hotmail.com','atshokunbi@gmail.com',
  'aimeegcheung@gmail.com','alunarobledo@gmail.com','andpol13@gmail.com',
  'christina.bellevue@gmail.com','parungo.maniya@gmail.com',
  'stacy.rosales@gmail.com','rojashwi@gmail.com','matt.manwaring@gmail.com'
]);

// Derive seniority from tenure
function deriveSeniority(tenure) {
  if (!tenure || tenure === '0' || typeof tenure === 'number') return 'No data';
  const t = String(tenure).toLowerCase();
  if (t.includes('under 3') || t.includes('short but mighty')) return 'Early Career';
  if (t.includes('3-7') || t.includes('solid chapter')) return 'Mid-Level';
  if (t.includes('8-15') || t.includes('deep roots')) return 'Senior';
  if (t.includes('16-25') || t.includes('lifer') || t.includes('25+') || t.includes('royalty')) return 'Executive';
  return 'No data';
}

// Derive engagement level from hours
function deriveEngagement(hours) {
  if (!hours || hours === '0' || typeof hours === 'number') return 'No data';
  const h = String(hours).toLowerCase();
  if (h.includes('minutes') || h.includes('like-and-share')) return 'Light';
  if (h.includes('hour or two')) return 'Light';
  if (h.includes('3-5')) return 'Medium';
  if (h.includes('6-10')) return 'Heavy';
  if (h.includes('10+')) return 'Heavy';
  return 'No data';
}

// Derive pipeline from leadership answer
function derivePipeline(leadPGAF) {
  if (!leadPGAF || leadPGAF === '0' || typeof leadPGAF === 'number') return 'No data';
  const l = String(leadPGAF).toLowerCase();
  if (l.includes('ready')) return 'Ready Now';
  if (l.includes('maybe')) return 'Warm Lead';
  if (l.includes('not now')) return 'Not Now';
  return 'No data';
}

// Parse date string properly
function parseDate(dateVal) {
  if (!dateVal) return '';
  const s = String(dateVal);
  // Handle DD/MM/YYYY HH:MM:SS format
  const match = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
  }
  // Handle YYYY-MM-DD
  if (s.match(/^\d{4}-\d{2}-\d{2}/)) return s.split(' ')[0];
  // Handle Excel serial number
  if (!isNaN(dateVal) && Number(dateVal) > 40000) {
    const date = new Date((Number(dateVal) - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  }
  return s.split(' ')[0];
}

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        const normalizedData = normalizeData(jsonData);
        resolve(normalizedData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

function normalizeData(jsonData) {
  // First pass: normalize
  const allRows = jsonData.map(row => {
    const email = (row["Best email to reach you?"] || row["Email"] || "").toLowerCase().trim();
    const leadPGAF = row["Nice. Open to leading something at PGAF?"] || row["Lead PGAF?"] || "";
    const tenure = row["How many years were you part of the P&G family?"] || row["Tenure"] || "";
    const hours = row["Real talk - how much time per month?"] || row["Hours"] || "";
    const easier = row["What would make it easier to get involved?"] || "";
    const submittedAt = row["Submitted At"] || "";

    return {
      name: row["What's your full name?"] || row["Name"] || "Unknown",
      email: email,
      location: row["Where are you based?"] || row["Location"] || "",
      status: row["What best describes your current situation?"] || row["Status"] || "",
      function: row["Back in your P&G days - what was your world?"] || row["Function"] || "",
      tenure: tenure,
      generation: row["Which generation do you belong to?"] || row["Generation"] || "",
      leadPGAF: typeof leadPGAF === 'number' ? '' : leadPGAF,
      skills: row["What would you bring to a team? Pick top 3."] || row["Skills"] || "",
      hours: typeof hours === 'number' ? '' : hours,
      easier: typeof easier === 'number' ? '' : easier,
      volunteering: row["Just one more! Are you currently volunteering or serving on a board for any non-profit? (We're totally not jealous)"] || "",
      ambassadorType: row["ambassador_type"] || "",
      donorStatus: row["donor_status"] || "",
      submittedAt: submittedAt,
      // Derived fields
      seniority: deriveSeniority(tenure),
      engagement: deriveEngagement(typeof hours === 'number' ? '' : hours),
      pipeline: derivePipeline(typeof leadPGAF === 'number' ? '' : leadPGAF),
      snAttendee: SN_EMAILS.has(email) ? 'Yes' : 'No',
      justAskMe: String(easier).toLowerCase().includes('just ask me') ? 'Yes' : 'No',
      dateClean: parseDate(submittedAt),
      raw: row
    };
  });

  // Deduplicate by email, keep latest submission
  const emailMap = {};
  allRows.forEach(row => {
    if (!row.email) return;
    if (!emailMap[row.email] || row.submittedAt > emailMap[row.email].submittedAt) {
      emailMap[row.email] = row;
    }
  });

  return Object.values(emailMap);
}

export const fetchGoogleSheetData = async (sheetUrl) => {
  try {
    const match = sheetUrl.match(/\/d\/(.*?)(\/|$)/);
    if (!match) throw new Error("Invalid Google Sheet URL");
    
    const sheetId = match[1];
    const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

    const response = await fetch(exportUrl);
    if (!response.ok) throw new Error("Failed to fetch Google Sheet");
    
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
    return normalizeData(jsonData);
  } catch (error) {
    console.error("Error fetching Google Sheet:", error);
    throw error;
  }
};Add derived fields and SN lookup
