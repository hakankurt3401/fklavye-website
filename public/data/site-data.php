<?php
// site-data.php - F Klavye ve Uçan Parmaklar Derneği Veri Dosyası
// Bu dosya site yedeğini içerir

header('Content-Type: application/json; charset=utf-8');
header('Content-Disposition: attachment; filename="site-data-' . date('Y-m-d') . '.json"');

$data = array(
    'site_name' => 'F Klavye ve Uçan Parmaklar Derneği',
    'url' => 'https://fklavye.org.tr',
    'export_date' => date('Y-m-d H:i:s'),
    'version' => '1.0',
    'association_info' => array(
        'name' => 'F KLAVYE UÇAN PARMAKLAR DERNEĞİ',
        'short_name' => 'FDER',
        'city' => 'Afyonkarahisar',
        'establishment_date' => '1957-05-05',
        'intersteno_member_since' => '1957-05-05'
    ),
    'contact' => array(
        'email' => 'info@fklavye.org.tr',
        'website' => 'https://www.fklavye.org.tr',
        'intersteno_representative' => 'Seçkin KÖSE',
        'representative_email' => 'seckinkose49@gmail.com'
    ),
    'pages' => array(
        'home' => '/',
        'tarihcemiz' => '/tarihcemiz',
        'tuzuk' => '/tuzuk',
        'yonetim_kurulu' => '/yonetim-kurulu',
        'denetim_kurulu' => '/denetim-kurulu',
        'haberler' => '/haberler',
        'intersteno_turk' => '/intersteno-turk',
        'galeri' => '/galeri',
        'videolar' => '/videolar',
        'f_klavye' => '/f-klavye',
        'iletisim' => '/iletisim'
    ),
    'intersteno' => array(
        'onursal_baskanlar' => array(
            'William Bonnet (İsviçre)',
            'Gabrielle Fasnacht (İsviçre)',
            'Gregor Keller (Almanya)',
            'Marlis Kulb (Avusturya)',
            'Mauro Panzera (İsviçre)',
            'Flaviano Rodriguez (İtalya)',
            'Marija Tomc (Slovenya)',
            'İhsan Yener (Türkiye)'
        ),
        'yonetim_kurulu_2017_2019' => array(
            'Başkan' => 'Rian Schwarz-van Poppel (Hollanda)',
            'Başkan Yardımcısı' => 'Russell Page (ABD)',
            'Genel Sekreter ve Sayman' => 'Danny Devriendt (Belçika)',
            'Juri Başkanı' => 'Georgette Sante (Belçika)',
            'Bilimsel Komite Başkanı' => 'Carlo Eugeni (İtalya)',
            'Yönetim Kurulu Üyesi' => 'Emrah Kuyumcu (Türkiye)',
            'Yönetim Kurulu Üyesi' => 'Krystian Wawrzynek (Polonya)',
            'Yönetim Kurulu Danışmanı' => 'Linda Drake (ABD)'
        )
    ),
    'yonetim_kurulu' => array(
        'asil_uyeler' => array(
            'BEKİR ARABACI',
            'MURAT ARISOY',
            'SÜLEYMAN UĞUR ÜNSOY',
            'SERKAN DEMİR',
            'NURGÜL YURDUNUSEVEN ARABACI'
        ),
        'yedek_uyeler' => array(
            'HÜSEYİN EROĞLU',
            'HASAN ABDİOĞULLARI',
            'EREN GÖKYER',
            'AHMET SARI',
            'CENGİZ SARIKOÇ'
        )
    ),
    'denetim_kurulu' => array(
        'asil_uyeler' => array(
            'AYSUN AKGÜL',
            'SABRİ ÇETİNGÜL',
            'SÜLEYMAN BAYKARA'
        ),
        'yedek_uyeler' => array(
            'MURAT KURT',
            'ABDULLAH TOLA',
            'ALİ ÖZDİNÇ'
        )
    ),
    'f_klavye' => array(
        'mucit' => 'İhsan YENER',
        'dogum_yili' => 1925,
        'dogum_yeri' => 'Afyon Karahisar',
        'standart_tarihi' => '1955-10-20',
        'ts_kodu' => 'TS 2117 – UDK 681.6.065'
    )
);

echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>