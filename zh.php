<?php
    require_once('data.php');
    $errors = [];
    $animalNames = [];
    $name = '';

    if(isset($_GET['name'])){
        $name = $_GET['name'];
    }
    if(!isset($_GET['legs']) || $_GET['legs'] === ''){
        $errors[] = 'Meg kell adni a lábak számát :c';
    }
    if(!isset($_GET['diet']) || $_GET['diet'] === ''){
        $errors[] = 'Meg kell adni az étrendet :c';
    }
    if(isset($_GET['diet']) && isset($_GET['legs']) && $_GET['legs'] !== '' && $_GET['diet'] !== ''){
        $legs = $_GET['legs'];
        $diet = $_GET['diet'];
        $animalNames = array_filter($animals, function($animal) use ($legs,$diet,$name){
            if($name !== ''){
                return $animal['legCount'] === (int)$legs && $animal['diet'] === $diet && $animal['name'] === $name;
            }else{
                return $animal['legCount'] === (int)$legs && $animal['diet'] === $diet;
            }
        });
        if($name !== '' && count($animalNames)===0){
            $errors[] = 'Nincs ilyen nevű állat az adatok között :C';
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="">
        Állat neve: <input name="name" type="text"><br>
        Lábak száma: <input name="legs" type="number"><br>
        Étrend:
        <select name="diet">
            <option value="mindenevő">mindenevő</option>
            <option value="ragadozó">ragadozó</option>
            <option value="növényevő">növényevő</option>
        </select><br>
        <button type="submit">submit</button>
    </form>
    <?php if(count($animalNames)>0):?>
        <ul>
            <?php foreach($animalNames as $anim): ?>
                <li><img src=<?=$anim['url']?> title=<?=$anim['name']?>></li>                
            <?php endforeach?>
        </ul>
    <?php endif?>
    <ul>
        <?php foreach($errors as $error): ?>
        <li><?=$error?></li>
        <?php endforeach?>
    </ul>
</body>
</html>