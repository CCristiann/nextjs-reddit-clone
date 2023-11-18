"use client";

import { useEffect } from "react";
import { EmailAddress } from "@clerk/nextjs/server";

const RedditMan = () => {
  useEffect(() => {
    console.log(`
                  ,d"=≥,.,qOp,
                 ,7'  ''²$(  )
                ,7'      '?q$7'
             ..,$$,.
   ,.  .,,--***²""²***--,,.  .,
 ²   ,p²''              ''²q,   ²
:  ,7'                      '7,  :
 ' $      ,db,      ,db,      $ '
  '$      ²$$²      ²$$²      $'    Rosita devi esplodere
  '$                          $'
   '$.     .,        ,.     .$'
    'b,     '²«»«»«»²'     ,d'
     '²?bn,,          ,,nd?²'
       ,7$ ''²²²²²²²²'' $7,
     ,² ²$              $² ²,
     $  :$              $:  $
     $   $              $   $
     'b  q:            :p  d'
      '²«?$.          .$?»²'
         'b            d'
       ,²²'?,.      .,?'²²,
      ²==--≥²²==--==²²≤--==²`);
  }, []);

  return null;
};

export default RedditMan;
