import { _jmAuth } from "./auth"
import { _jmUser } from "./user"
import { _jmImage } from "./image"
import { _jmSearch } from "./search"
import { _jmComic } from "./comic"
import { _jmComment } from "./comment"
import { _jmApiAuth } from "./api/auth"
import { _jmApiSearch } from "./api/search"
import { _jmApiComic } from "./api/comic"
import { _jmApiComment } from "./api/comment"
import { _jmApiUser } from "./api/user"

export namespace jm {
  export type SearchMode = 'jid' | 'keyword' | 'category' | 'tag'
  export type SortType = 'mv' | 'mp' | 'tf' | '' | LevelSort
  export type LevelSort = 'mv_m' | 'mv_w' | 'mv_t'

  export import auth = _jmAuth
  export  import comic = _jmComic
  export import search = _jmSearch
  export import user = _jmUser
  export import image = _jmImage
  export import comment = _jmComment
}

export namespace jm.api {
  export import auth = _jmApiAuth
  export import search = _jmApiSearch
  export import comic = _jmApiComic
  export import comment = _jmApiComment
  export import user = _jmApiUser

}