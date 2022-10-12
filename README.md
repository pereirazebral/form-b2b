# garbe-app

Os steps 01 e 02 são necessários caso você opte por utilizar .`scss` 

**Step 01** 

Abra o terminal e rode o comando: 

`npm install --global gulp-cli`

**OBS.** Caso você já tenha o `gulp-cli` rode apenas o comando na pasta raiz do projeto:

`npm install` 

___

**Step 02** 

Abra uma nova aba do `terminal` e rode o comando:

`gulp`

**OBS.** O comando `gulp` gera os arquivos `.css` no mesmo diretório apartir dos arquivos `.scss` as configurações estão no aquivo [`gulpfile.js`](./gulpfile.js)

___

**Step 03** 

Abra o terminal e rode o comando:

`vtex link --verbose`
___

**Step 04** 

No `app` de `thema` de sua loja declare esse `app` como dependencia no arquivo `manifest.json` 

``` 
"dependencies": {
    "{{account}}.app-name": "0.x"
}
```

Rode o comando `vtex link --verbose` no `app` de `thema`

___

**Step 05**

Declare um bloco para o app e utilize no seu layout da forma que desejar.

```
"flex-layout.row#garbe-app": {
    "title": "Bloco :: Garbe App",
    "props": {
      "blockClass": "garbe-app"
    },
    "children": [
        "garbe-app"
    ]
}
```
___