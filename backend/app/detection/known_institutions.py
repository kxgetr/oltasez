"""
Official Registered Domains Dictionary & Lookup for Turkey.
Protects against naive substring matching vulnerabilities
(e.g., preventing 'turkiye-gov-tr.phishingsite.com' or 'garantibbvaguvenlik.cc' from tricking substring checks).
"""

from typing import Dict, List, Optional, Set, Any

# Known legitimate institution domains mapped to their canonical root domains
OFFICIAL_INSTITUTION_DOMAINS: Dict[str, Dict[str, Any]] = {
    "turkiye_gov": {
        "name": "e-Devlet Kapısı",
        "official_roots": {"turkiye.gov.tr"},
        "institution_keywords": ["turkiye.gov", "e-devlet", "edevlet", "turkiye-gov"]
    },
    "kgm_hgs": {
        "name": "Karayolları Genel Müdürlüğü & HGS",
        "official_roots": {"kgm.gov.tr", "hgsmusteri.ptt.gov.tr", "epttavm.com"},
        "institution_keywords": ["hgs", "ogs", "kgm", "karayollari", "gecis-ucreti"]
    },
    "ptt": {
        "name": "PTT Posta ve Telgraf Teşkilatı",
        "official_roots": {"ptt.gov.tr", "gonderitakip.ptt.gov.tr"},
        "institution_keywords": ["ptt", "ptt-kargo", "pttkargo"]
    },
    "gib": {
        "name": "Gelir İdaresi Başkanlığı / Vergi Dairesi",
        "official_roots": {"gib.gov.tr", "ivd.gib.gov.tr", "dijital.gib.gov.tr"},
        "institution_keywords": ["gib", "geliridaresi", "vergidairesi"]
    },
    "adliye_uyap": {
        "name": "Adalet Bakanlığı & UYAP",
        "official_roots": {"adalet.gov.tr", "uyap.gov.tr", "vatandas.uyap.gov.tr"},
        "institution_keywords": ["uyap", "adalet", "yargitay", "danistay"]
    },
    "ziraat": {
        "name": "Ziraat Bankası",
        "official_roots": {"ziraatbank.com.tr", "ziraatkatilim.com.tr"},
        "institution_keywords": ["ziraat", "ziraatbank"]
    },
    "garanti": {
        "name": "Garanti BBVA",
        "official_roots": {"garantibbva.com.tr"},
        "institution_keywords": ["garanti", "garantibbva"]
    },
    "isbank": {
        "name": "Türkiye İş Bankası",
        "official_roots": {"isbank.com.tr"},
        "institution_keywords": ["isbank", "isbankasi"]
    },
    "yapkredi": {
        "name": "Yapı Kredi Bankası",
        "official_roots": {"yapikredi.com.tr"},
        "institution_keywords": ["yapikredi"]
    },
    "akbank": {
        "name": "Akbank",
        "official_roots": {"akbank.com", "akbank.com.tr"},
        "institution_keywords": ["akbank"]
    },
    "qnb": {
        "name": "QNB Finansbank",
        "official_roots": {"qnb.com.tr", "qnbfinansbank.com"},
        "institution_keywords": ["qnb", "finansbank"]
    },
    "turkcell": {
        "name": "Turkcell",
        "official_roots": {"turkcell.com.tr"},
        "institution_keywords": ["turkcell"]
    },
    "vodafone": {
        "name": "Vodafone Türkiye",
        "official_roots": {"vodafone.com.tr"},
        "institution_keywords": ["vodafone"]
    },
    "turktelekom": {
        "name": "Türk Telekom",
        "official_roots": {"turktelekom.com.tr"},
        "institution_keywords": ["turktelekom", "ttnet"]
    }
}
