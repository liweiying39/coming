
%lex

/** identifiers **/
identifier                              ("_"|{letter})({letter}|{digit}|"_")*
letter                                  {lowercase}|{uppercase}
lowercase                               [a-z]
uppercase                               [A-Z]
digit                                   [0-9]

/** strings **/
string                                  '"'{stringitem}*'"'
stringitem                              {stringchar}|{escapeseq}
stringchar                              [^\\\n\"]
escapeseq                               \\.

/** numbers **/
number                                  {digit}+

/** symbol **/
symbols                                 ">="|"<="|"<-"|"=="|"!="
                                        |">"|"<"|"~="|"||"|"&&"
                                        |"("|")"|"["|"]"|","

/** whitespaces **/
whitespaces                             ([\ \t\f\n])+

%%

<<EOF>>                                 return 'EOF'
{symbols}                               return yytext
{number}                                return 'NUMBER'
{string}                                return 'STRING'
{identifier}                            return 'NAME'
{whitespaces}                           /** skip **/

/lex

%start query

%right '||' '&&'

%%

/**  Module **/

query
    : expr EOF { return $1 }
    ;

expr
    : con { $$ = $1 }
    | '(' expr ')' { $$ = $2 }
    | expr '&&' expr { $$ = {type:'and', left:$1, right:$3} }
    | expr '||' expr { $$ = {type:'or', left:$1, right:$3} }
    ;

con
    : NAME  ">" value { $$ = {type:'gt', left:$1, right:$3} }
    | NAME  "<" value { $$ = {type:'lt', left:$1, right:$3} }
    | NAME ">=" value { $$ = {type:'gte', left:$1, right:$3} }
    | NAME "<=" value { $$ = {type:'lte', left:$1, right:$3} }
    | NAME "==" value { $$ = {type:'eq', left:$1, right:$3} }
    | NAME "!=" value { $$ = {type:'neq', left:$1, right:$3} }
    | NAME "~=" value { $$ = {type:'like', left:$1, right:$3} }
    | NAME "<-" '[' list_body ']' { $$ = {type:'in', left:$1, right:$4} }
    ;

value
    : NUMBER { $$ = parseInt($1) }
    | STRING { $$ = $1.slice(1, -1)}
    ;

list_body
    : list_body ',' value { $$ = $1.concat([$3]) }
    | value { $$ = [$1]}
    ;
