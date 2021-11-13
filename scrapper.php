<?php

// Scrapper para html iconos e imagenes
/* for ($i = 101; $i <= 201; $i++) {

    $number = $i;
    if ($i<100) $number = '0'.$i;
    if ($i<10) $number = '00'.$i;
    echo "LOADING https://stealpantyes.com.mx/7dsjp/characters/" . $number;
    $result = shell_exec("curl https://stealpantyes.com.mx/7dsjp/characters/".$number);
    file_put_contents('pages/'.$number.'.html', $result);

    shell_exec("curl https://stealpantyes.com.mx/assets/img/7ds/heroIllust/picture".$number.'.png > images/'.$number.'.png');
    shell_exec("curl https://stealpantyes.com.mx/assets/img/7ds/heroIcon/character".$number.'.png > icons/'.$number.'.png');
} */


/* for ($i = 1; $i <= 201; $i++) {

    $number = $i;
    if ($i<100) $number = '0'.$i;
    if ($i<10) $number = '00'.$i;
    $result = file_get_contents('pages/'.$number.'.html');

    preg_match('/<tbody class="tbody pictureprofile">(.*?)<\/tbody>/s', $result, $match);

    if (count($match)>0){
        preg_match('/\](.*?)<\/h5>/s', $match[0], $match);
        $res = $match[0];
        $res = str_replace(']', '', $res);
        $res = str_replace('</h5>', '', $res);
        $res = str_replace('</br>', '', $res);
        $fullname = trim($res);

        preg_match('/<title>(.*?)<\/title>/s', $result, $match);
        $res = $match[0];
        $res = str_replace('<title>', '', $res);
        $res = str_replace('</title>', '', $res);
        $res = str_replace('| Seven Deadly Sins: Grand Cross', '', $res);
        $name = trim($res);

        $stats = array();
        if (strpos($result, 'Equipamiento Recomendado')>0)
            preg_match('/<th colspan="2">Equipamiento Recomendado(.*?)<\/tbody>/s', $result, $match);
        else
            preg_match('/<th colspan="2">Accesorios Recomendados(.*?)<\/tbody>/s', $result, $match);
        $dom = new domDocument();
        $dom->loadHTML($match[0]);
        foreach ($dom->getElementsByTagName('img') as $row) {
            array_push($stats, str_replace('.png','',str_replace('../../assets/img/7ds/','',$row->getAttribute('src'))));
        }

        $substats = array();
        preg_match('/<th>Substats Recomendados(.*?)<\/tbody>/s', $result, $match);
        $dom = new domDocument();
        $dom->loadHTML(str_replace('</br>',' ', $match[0]));
        foreach ($dom->getElementsByTagName('td') as $row) {
            
            $links = $dom->getElementsByTagName('b');
            $links_to_remove = [];

            foreach($links as $link){
                $links_to_remove[] = $link;
            }

            foreach($links_to_remove as $link){
                $link->parentNode->removeChild($link);
            }

            $val = $row->nodeValue;
            $val = str_replace('  ','|', str_replace('  ',' ', str_replace('  ',' ', $val)));
            if (substr($val, -1)=='|') $val = substr($val, 0, -1);
            array_push($substats, trim($val));
        }

        preg_match('/<h5>Habilidad Pasiva(.*?)<\/tbody>/s', $result, $match);
        $dom = new domDocument();
        $dom->loadHTML('<?xml encoding="utf-8" ?>' . $match[0]);
        foreach ($dom->getElementsByTagName('p') as $row) {
            $pasiva = trim($row->nodeValue);
        }
        
        preg_match('/<h5>Gracia(.*?)<\/tbody>/s', $result, $match);
        $dom = new domDocument();
        $dom->loadHTML('<?xml encoding="utf-8" ?>' . $match[0]);
        $gracia = '';
        foreach ($dom->getElementsByTagName('p') as $row) {
            $gracia = trim($row->nodeValue);
        }

        preg_match('/<h5>Mandamiento(.*?)<\/tbody>/s', $result, $match);
        $dom = new domDocument();
        $dom->loadHTML('<?xml encoding="utf-8" ?>' . $match[0]);
        $mandamiento = '';
        foreach ($dom->getElementsByTagName('p') as $row) {
            $mandamiento = trim($row->nodeValue);
        }

        preg_match('/<h5>Reliquia Sagrada(.*?)<\/tbody>/s', $result, $match);
        $dom = new domDocument();
        $dom->loadHTML('<?xml encoding="utf-8" ?>' . $match[0]);
        $reliquia = '';
        foreach ($dom->getElementsByTagName('p') as $row) {
            $reliquia = trim($row->nodeValue);
        }

        preg_match('/<td>Atributo(.*?)<\/tr>/s', $result, $match);
        $dom = new domDocument();
        $dom->loadHTML('<?xml encoding="utf-8" ?>' . $match[0]);
        foreach ($dom->getElementsByTagName('img') as $row) {
            $atributo = str_replace('.png','',str_replace('../../assets/img/7ds/','',$row->getAttribute('src')));
        }
        

        $newstats = array();
        foreach ($stats as $stat)
        {
            if ($stat == 'atk') array_push($newstats, 'Ataque');
            else if ($stat == 'dc') array_push($newstats, 'Daño crítico');
            else if ($stat == 'def') array_push($newstats, 'Defensa');
            else if ($stat == 'hp') array_push($newstats, 'HP');
            else array_push($newstats, $stat);

        }


        $name = str_replace('á', 'a', $name);
        $name = str_replace('é', 'e', $name);
        $name = str_replace('í', 'i', $name);
        $name = str_replace('ó', 'o', $name);
        $name = str_replace('ú', 'u', $name);
        $fullname = str_replace('á', 'a', $fullname);
        $fullname = str_replace('é', 'e', $fullname);
        $fullname = str_replace('í', 'i', $fullname);
        $fullname = str_replace('ó', 'o', $fullname);
        $fullname = str_replace('ú', 'u', $fullname);


        $pre = '';
        if ($atributo=='speed') $pre = "b";
        else if ($atributo=='vitality') $pre = "g";
        else $pre = "r";

        if ($atributo=='speed') $atributo = "Velocidad";
        else if ($atributo=='vitality') $atributo = "PS";
        else $atributo = "Fuerza";


        $post = 0;

        
        while (isset($settings[$pre.strtolower($name).($post==0?'':$post)]['name']))
            $post = ($post==0? 2 : $post +1);

        $settings[$pre.strtolower($name).($post==0?'':$post)]['number'] = $number;
        $settings[$pre.strtolower($name).($post==0?'':$post)]['name'] = $name;
        $settings[$pre.strtolower($name).($post==0?'':$post)]['fullname'] = $fullname;
        $settings[$pre.strtolower($name).($post==0?'':$post)]['attribute'] = $atributo;
        $settings[$pre.strtolower($name).($post==0?'':$post)]['stats'] = implode(',', $newstats);
        $settings[$pre.strtolower($name).($post==0?'':$post)]['substats'] = implode(',', $substats);
        $settings[$pre.strtolower($name).($post==0?'':$post)]['passive'] = $pasiva;
        $settings[$pre.strtolower($name).($post==0?'':$post)]['grace'] = $gracia;
        $settings[$pre.strtolower($name).($post==0?'':$post)]['commandment'] = $mandamiento;
        $settings[$pre.strtolower($name).($post==0?'':$post)]['reliq'] = $reliquia;

        echo "::: ".$number." ::::";
        var_dump($settings[$pre.strtolower($name).($post==0?'':$post)]);
    }

    file_put_contents('database.json', json_encode($settings, JSON_PRETTY_PRINT));



} */

    $settings = json_decode(file_get_contents('database.json'));

    foreach ($settings as $key => $val)
        echo $key."\n";



?>