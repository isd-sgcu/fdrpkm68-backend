import { prisma } from "../src/lib/prisma";

async function setup() {
	console.log("🚀 Setting up house data...");

	console.log("🗑️ Cleaning existing house data...");
	await prisma.house.deleteMany({});

	const houses = await prisma.house.createManyAndReturn({
		data: [
			{
				nameThai: "บ้านอะอึ๋ม",
				nameEnglish: "Baan A-Aum",
				descriptionThai:
					"น้อง ๆ คนไหนกำลังมองหาบ้านที่ขนาดไม่ใหญ่มาก แต่เราอยู่กันอย่างอบอุ่น ได้รู้จักเพื่อนและรุ่นพี่จากหลากหลายคณะทั่วจุฬาฯ บ้านอะอึ๋มมีสิ่งที่น้อง ๆ กำลังมองหาอยู่ แล้วมาเจอกันน้า",
				descriptionEnglish:
					"If you’re looking for a cozy baan that’s not too big where you can meet new friends from all across Chula, come and join us on Aug 1-3 at Baan A-Aum🏠",
				facebook: "",
				instagram:
					"https://www.instagram.com/baanaaum.official?igsh=MXM1Z2d2dTRqcmI2aw==",
				tiktok: "https://www.tiktok.com/@baanaaum1995?_t=ZP-8xRQ3hiwDyJ&_r=1",
				sizeLetter: "M",
				capacity: 252,
			},

			{
				nameThai: "บ้านสด",
				nameEnglish: "Baansod",
				descriptionThai:
					"บ้านสดเป็นบ้านที่พร้อมส่งความสุขและความสนุกให้กับเหล่าเฟรชชี่ แล้วเจอกันที่สดเด้อ เอ้กเพรส!",
				descriptionEnglish:
					"Sodder Express doesn’t just deliver packages — it delivers friendship, warmth, and non-stop laughs. This ride goes straight to your heart. Miss it and you’ll miss out!",
				facebook: "",
				instagram:
					"https://www.instagram.com/baansod.official?igsh=MXNkcXF6ZmQzd2dreQ==",
				tiktok: "https://www.tiktok.com/@baansod.official?_t=ZS-8xVFMAFa5Dz&_r=1",
				sizeLetter: "L",
				capacity: 324,
			},

			{
				nameThai: "บ้านโจ๋",
				nameEnglish: "Baan Jo+",
				descriptionThai:
					"เมื่อบ้านนี้รวมตัววัยรุ่นที่ไม่ธรรมดา เรื่องราวสุดป่วนจึงเริ่มต้นขึ้น พร้อมจะว้าวุ่นไปกับพวกเรารึยัง!",
				descriptionEnglish:
					"When this house brings together extraordinary teens, the chaos begins. Ready to make unforgettable memories with us?",
				facebook: "",
				instagram:
					"https://www.instagram.com/baanjochula?igsh=MXdrdDBnMHRkNHlvbg%3D%3D&utm_source=qr",
				tiktok: "https://www.tiktok.com/@baanjochula2025?_t=ZS-8xfBBeOKdx1&_r=1",
				sizeLetter: "XL",
				capacity: 792,
			},

			{
				nameThai: "บ้านโบ้",
				nameEnglish: "BaanBoe",
				descriptionThai:
					"บ้านโบ้ จุดรวมพลน้องหมาสุดน่ารัก ทุกสายพันธุ์ ทุกสไตล์ อยู่ด้วยกันอย่างอบอุ่น มาเป็นโบ้ด้วยกันมั้ย โฮ่งง!",
				descriptionEnglish:
					"Welcome to BannBoe - A cozy pack of love, laughs, and loyal friends. Come join us!",
				facebook: "",
				instagram:
					"https://www.instagram.com/baanboe?igsh=MWx1MmJrc2poeGJodw==",
				tiktok: "https://www.tiktok.com/@baanboe?_t=ZS-8xfTm87Sy07&_r=1",
				sizeLetter: "M",
				capacity: 129,
			},

			{
				nameThai: "บ้านดัง",
				nameEnglish: "Baandung",
				descriptionThai:
					"เห็นเธอเดินเข้ามา บ้านดังก็ละสายตาไม่ได้ ~🎵\n📢 มักม่วน มักจอย มาเจอกันรถแห่บ้านดัง 🛺",
				descriptionEnglish:
					"come and join us at the place full of laugh & love ♥️",
				facebook: "",
				instagram:
					"https://www.instagram.com/baandung.official?igsh=MTVjaDhvbjYzZWE5MA==",
				tiktok: "https://www.tiktok.com/@baandung_chula?_t=ZS-8xh22JcgaPw&_r=1",
				sizeLetter: "S",
				capacity: 90,
			},

			{
				nameThai: "บ้านคุณหนู",
				nameEnglish: "Baankhunnoo",
				descriptionThai:
					'บ้านคุณหนู ไซส์ S เล็กอบอุ่น รู้จักกันอย่างทั่วถึง มี "บอร์ดเกม" เป็นหัวใจหลัก ไม่มีเต้นสันทนาการ หากคุณหนูสนใจ ก็ขอเชิญให้มาเลือกบ้านคุณหนู',
				descriptionEnglish:
					"Baan Khunnoo is a small, cozy house where everyone can get to know each other with board games . Additionally, we have no dancing! If you're interested, CHOOSE BAAN KHUNNOO.",
				facebook:
					"https://www.facebook.com/BaanKhunNooCU/?locale=th_TH",
				instagram:
					"https://www.instagram.com/baankhunnoo_official?igsh=b3d1MXBweWg3aWIw",
				tiktok: "",
				sizeLetter: "S",
				capacity: 123,
			},

			{
				nameThai: "บ้านเดอะ",
				nameEnglish: "BAANTHE",
				descriptionThai:
					"BAAN THE CHULA บ้านแห่งความฮ๊อบ มอบทุกรอยยิ้ม อิ่มเสียงหัวเราะ ✨\nเกราะแห่งมิตรภาพ จ๊าบแบบจุกจุก สนุกทุกโมเมนต์ 💖",
				descriptionEnglish:
					"BAANTHE CHULA — Unforgettable fun, guaranteed: We are the one and only leading billionaires! 💸🏦",
				facebook: "",
				instagram: "https://www.instagram.com/baanthechula.official/",
				tiktok: "https://www.tiktok.com/@baanthechula",
				sizeLetter: "S",
				capacity: 114,
			},

			{
				nameThai: "บ้านจิ๊จ๊ะ",
				nameEnglish: "BaanJiJah",
				descriptionThai:
					"🚨คำเตือน: JiJah กำลังบุกรุกโลกออนไลน์อย่างหนัก🛜💥\nCU109 เตรียมตัวให้พร้อม รับมือความปั่นป่วนที่กำลังจะตามมา🫂♥️\n#JiJahBreaksThelnternet",
				descriptionEnglish:
					"Shouldn’t it be “JiJah Wrecks the Internet”? 🛜💥\nGet ready, CU109! JiJah might break the internet, but we’ll never break your heart 🫂♥️\n#JiJahBreaksTheInternet",
				facebook: "",
				instagram:
					"https://www.instagram.com/baanjijah.chula?igsh=OHFmYnFtejBzaXpq&utm_source=qr",
				tiktok: "https://www.tiktok.com/@baanjijah.chula?_t=ZS-8xhNCNKRyGw&_r=1",
				sizeLetter: "M",
				capacity: 201,
			},

			{
				nameThai: "บ้านคุ้ม",
				nameEnglish: "BAAN KOOM",
				descriptionThai:
					"บ้านคุ้ม บ้านที่มีการสันทนาการเป็นเอกลักษณ์ที่สุดในจุฬาฯ เปี่ยมด้วยความอลังการ ยิ่งใหญ่ และอบอุ่นด้วยรักจากทั่วทุกสารทิศ",
				descriptionEnglish:
					"Baan Koom—the house of unique recreational spirit in all of Chulalongkorn University. We stand for grandeur, greatness, and heartfelt love like nowhere else.",
				facebook:
					"https://www.facebook.com/profile.php?id=100081054411606",
				instagram: "https://www.instagram.com/baankoom.chula/",
				tiktok: "https://www.tiktok.com/@baankoom.chula",
				sizeLetter: "XL",
				capacity: 532,
			},

			{
				nameThai: "บ้านนอก",
				nameEnglish: "Baan Nork",
				descriptionThai:
					"ตั้งแต่ยุคแพนเจีย “บ้านนอก” เป็นที่พักใจของทุกสปีชีส์ มอบทั้งความอบอุ่นและความสนุก และตอนนี้พร้อมต้อนรับ 109 ทุกคนแล้ว #พื้นที่ปลอดภัย #พิกัดลับสามย่าน",
				descriptionEnglish:
					"Everyone in this room, everyone in this country, everyone on this planet; last week you eliminate my team but today it’s my turn Baan Nork would like to pencil",
				facebook: "",
				instagram:
					"https://www.instagram.com/baannork.chula?igsh=aHFxZDJ2bTAwbno1",
				tiktok: "https://www.tiktok.com/@baannork.chula?_t=ZS-8xhBuUFvWlz&_r=1",
				sizeLetter: "M",
				capacity: 183,
			},

			{
				nameThai: "โจ๊ะเด๊ะ ฮือซา",
				nameEnglish: "Jodeh Huesa",
				descriptionThai:
					"“โจ๊ะเด๊ะ ฮือซา” ตำนานบ้านของจุฬาฯ since 1992 #ติดจุฬามาบ้านโจ๊ะเด๊ะฮือซา",
				descriptionEnglish:
					"Can’t wait to see u ! Welcome CU 109 to Baan Jodeh Huesa!",
				facebook: "",
				instagram:
					"https://www.instagram.com/jodeh_official?igsh=MWZuMTZ5bXgycGIxaA%3D%3D&utm_source=qr",
				tiktok: "https://www.tiktok.com/@jodeh_official?_t=ZS-8xiibLfRiOf&_r=1",
				sizeLetter: "M",
				capacity: 297,
			},

			{
				nameThai: "บ้านว้อนท์",
				nameEnglish: "BaanWanted",
				descriptionThai:
					"ไม่ว่าใครจะฆ่าอารยา หรือพยูนจะมีพิรุธ\nแต่บ้าน WANTED รวมทุกความสนุก ปลุกความแต๋วแตก กระแทกความมันส์\nจอยจัดใหญ่ มันส์จัดเต็ม แหกไม่ยั้ง ฮาปังทุกองศา!",
				descriptionEnglish:
					'No matter who killed Araya or whether Payoon is acting suspicious,\n" BaanWanted " brings all the fun together.\nGet ready to burst with your fabulous side and crash into the chaos!',
				facebook:
					"https://www.facebook.com/share/15RiHeYCe3/?mibextid=qi2Omg",
				instagram:
					"https://www.instagram.com/baan_wanted?igsh=MXdiZmhwd2h1bHE1eQ==",
				tiktok: "https://www.tiktok.com/@baanwanted?_t=ZS-8xiEHc0G1jN&_r=1",
				sizeLetter: "S",
				capacity: 96,
			},

			{
				nameThai: "บ้านแจ๋ว",
				nameEnglish: "BAAN JAEW",
				descriptionThai:
					"บ้านแจ๋ว: หน่วยแห่งความอบอุ่น พื้นที่ให้ทุกคนได้เรียนรู้ เป็นตัวเอง สนุกสนาน และสร้างความผูกพันดุจครอบครัว",
				descriptionEnglish:
					"BAAN JAEW: A unit of warmth. A space for everyone to learn, be themselves, have fun, and build family-like bonds together.",
				facebook: "",
				instagram: "https://www.instagram.com/baanjaew/",
				tiktok: "https://www.tiktok.com/@baanjaew",
				sizeLetter: "L",
				capacity: 357,
			},

			{
				nameThai: "บ้านแรงส์",
				nameEnglish: "BaanRangs",
				descriptionThai:
					"บ้านแรงส์ บ้านขนาดใหญ่ที่สุดของจุฬาฯ ที่สืบทอดมานานกว่า 25 ปี ที่รวมเพื่อนต่างคณะ ผ่านกิจกรรมสุดสร้างสรรค์เป็นเอกลักษณ์ พร้อมความสนุกสนาน และสายสัมพันธ์ที่ยั่งยืน",
				descriptionEnglish:
					"Baan Rangs, the largest and longest-standing Baan Rub Puen at Chula, has united students across faculties for over 25 years through creative, spirited activities that spark joy and forge lasting, one-of-a-kind connections",
				facebook: "https://www.facebook.com/baanrang.official?",
				instagram:
					"https://www.instagram.com/baanrangs.official/?igsh=MWViczk0a2ZtaDh6Mg%3D%3D&utm_source=qr",
				tiktok: "https://www.tiktok.com/@baanrangs.official?_t=ZS-8xilJ9bF2Kl&_r=1",
				sizeLetter: "XXL",
				capacity: 1248,
			},

			{
				nameThai: "บ้านเฮา",
				nameEnglish: "BaanHaaw",
				descriptionThai:
					"มาเป็นครอบครัวเดียวกันกับ “บ้านเฮา” ชิวๆ สไตล์เฮา ในธีมเฮาลีวูด สนุก ฮา ปังทุกซีน!",
				descriptionEnglish:
					"Join “Baan Haaw” – chill vibes, Hollywood dreams. Freshy life, fun times, one big family!",
				facebook: "",
				instagram:
					"https://www.instagram.com/baan.haaw?igsh=bzlpaHluM2g1dXp1",
				tiktok: "https://www.tiktok.com/@baanhaaw?_t=ZS-8xinW3kY5nb&_r=1",
				sizeLetter: "L",
				capacity: 357,
			},

			{
				nameThai: "บ้านเอช้วน",
				nameEnglish: "Baan A-Chuan",
				descriptionThai:
					'มังกรตระหง่าน สันทนาการพลิ้วไหว\nเสียงกลองดังสนั่นถึงใจ "เอช้วน" ยิ่งใหญ่ในปฐพี',
				descriptionEnglish:
					'Mangkon trarangan santhanakan pliw-wai\nSiang klong dang sanan thueng chai\n"A-Chuan" ying yai nai pathapee',
				facebook:
					"https://www.facebook.com/share/16eBjzCqXq/?mibextid=wwXIfr",
				instagram:
					"https://www.instagram.com/baanachuan_official?igsh=a3A1c2Ryd2FnNmJ2",
				tiktok: "",
				sizeLetter: "M",
				capacity: 249,
			},

			{
				nameThai: "บ้านคิดส์",
				nameEnglish: "baankids",
				descriptionThai:
					"“OHANA”แปลว่า“ครอบครัว” แล้วมาเป็นครอบครัวบ้านคิดส์2025 กันนะ!",
				descriptionEnglish:
					"“OHANA” means “Family”. Come and be a part of BaanKids2025!",
				facebook: "",
				instagram:
					"https://www.instagram.com/baankids.official?igsh=MTI5YzZ4c3c0ZGwyYg==",
				tiktok: "https://www.tiktok.com/@baankids.official?_t=ZS-8xiqNbEO1WE&_r=1",
				sizeLetter: "L",
				capacity: 210,
			},

			{
				nameThai: "อากาเป้",
				nameEnglish: "agape",
				descriptionThai:
					"บ้านอากาเป้ยินดีต้อนรับ CU109 ทุกท่าน เข้าสู่ดินแดนแหล่งอารยธรรมที่ห้อมล้อมไปด้วยพลังแห่งอากาเป้ พลังความรักอันไร้เงื่อนไข",
				descriptionEnglish:
					"Baan Agape welcomes CU109 to the sacred realm of Agape, the power of unconditional love. 💕",
				facebook: "https://m.facebook.com/baanagape/?",
				instagram:
					"https://www.instagram.com/baanagapechula?igsh=d29pdHMzcGczNGpm",
				tiktok: "",
				sizeLetter: "S",
				capacity: 96,
			},

			{
				nameThai: "บ้านโคะ",
				nameEnglish: "BAANKOH",
				descriptionThai:
					"#ซิ่งให้สุดแล้วหยุดที่แดนซ์ฟลอร์\n#ถ้าคุณยังไม่มีใครกรุณาเปิดใจให้โคะ",
				descriptionEnglish: "Life’s too slow? Add some KOH",
				facebook:
					"https://www.facebook.com/share/1GMk8gmmxx/?mibextid=wwXIfr",
				instagram:
					"https://www.instagram.com/baankohchula?igsh=MXd2enQ4Z3U2MjFwNg==",
				tiktok: "",
				sizeLetter: "S",
				capacity: 123,
			},

			{
				nameThai: "บ้านโซ้ยตี๋หลีหมวย",
				nameEnglish: "BaanSoeiteeLheemouy",
				descriptionThai:
					"ฟ้าดิงท่านเลือกเลี้ยว⚡️ถ้าลื้อไม่สมัครบ้านโซ้ยตี๋หลีหมวย🧧 ลื้อจะต้องเสียใจไปตะหลอกกาล ❗️อย่ามัวรอช้า ความสนุกกำลังรอลื้ออยู่🫵",
				descriptionEnglish:
					"The heaven has already chosen⚡️If you do not join Baan SoeiteeLheemouy🧧, regretful shall you be for the rest of eternity❗️Make haste, your journey awaits you 🫵",
				facebook: "",
				instagram:
					"https://www.instagram.com/baansoeiteelheemouy?igsh=cHJqMGlua3E1cGdx&utm_source=qr",
				tiktok: "https://www.tiktok.com/@baansoeiteelheemouy?_t=ZS-8xir5hmUlzW&_r=1",
				sizeLetter: "XL",
				capacity: 784,
			},

			{
				nameThai: "บ้านยิ้ม",
				nameEnglish: "BaanYim",
				descriptionThai:
					"ลักยิ้มที่ว่าน่ารัก หรือจะสู้ความรักที่มาจากบ้านยิ้ม",
				descriptionEnglish:
					"Who's got that cute smile? 😝🙋🏻\u200d♀️\nWell then, time to join BaanYim the House of Smiles, right? ",
				facebook:
					"https://www.facebook.com/profile.php?id=100067133496337",
				instagram:
					"https://www.instagram.com/baanyimchula?igsh=MWE2bWVxc2xseWoyaw%3D%3D&utm_source=qr",
				tiktok: "https://www.tiktok.com/@baanyimcu?_t=ZS-8xiuGEELgOO&_r=1",
				sizeLetter: "XXL",
				capacity: 804,
			},

			{
				nameThai: "บ้านหลายใจ",
				nameEnglish: "Baan Laijai",
				descriptionThai:
					"ถ้าเขาไม่รักก็มาพักที่บ้านหลายใจ เพราะถึงจะชื่อหลายใจ แต่รักใครรักจริง 😉",
				descriptionEnglish:
					"He or she says no? Come rest your heart at Lai Jai. Even if Lai Jai means many hearts, we truly love if we love someone.💜",
				facebook: "",
				instagram:
					"https://www.instagram.com/baanlaijai/profilecard/?igsh=b2QyajJtdzh1OW8z",
				tiktok: "https://www.tiktok.com/@baanlaijai2025?_t=ZS-8xixh5ev5Av&_r=1",
				sizeLetter: "S",
				capacity: 135,
			},
		],
		skipDuplicates: true,
	});

	console.log("✅ House data created successfully!");
	console.log(`\n📋 Created ${houses.length} Houses:`);
	houses.forEach((house) => {
		console.log(`  - ${house.nameEnglish} (ID: ${house.id})`);
	});
}

setup()
	.then(() => prisma.$disconnect())
	.catch((error) => {
		console.error("❌ Error setting up house data:", error);
		process.exit(1);
	});
