
const serialize = function(obj: any) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

const defaultKalturaServerUrl = 'https://www.kaltura.com/api_v3'
export interface GetEntriesData {
  keyword: string,
  page: number
  pageSize: number
}

export interface MediaQueryApiConfig {
  ks: string,
  serverUrl: string
}

export class MediaQueryApi {

  constructor(private _config: MediaQueryApiConfig) {

  }

  private _validateConfig() {
    if(!this._config.ks) {
      return new Error('missing ks config value')
    }

    return null;
  }

  private _getKalturaServerUrl() {
    return `${this._config.serverUrl || defaultKalturaServerUrl}/?format=1`
  }

  getEntries({
                     keyword,
                     page,
                     pageSize
                   }: GetEntriesData) {

    return new Promise((resolve) => {
      const validationError = this._validateConfig();

      if (validationError) {
        resolve({ status: false, error: validationError})
        return;
      }

      const serverUrl = this._getKalturaServerUrl();

      let xhr = new XMLHttpRequest();
      xhr.open('POST', serverUrl);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onload = function() {
        if (this.status == 200) {
          try {
            const result = JSON.parse(this.responseText);

            if (result.objectType === "KalturaAPIException") {
              resolve({ status: false, errorCode: result.code, error: new Error(result.message)})
              return;
            }
            resolve({ status: true, data: result})
            return;

          } catch(error) {
            resolve({ status: false, errorCode: 'general-error', error: error})
            return;
          }
        } else {
          resolve({ status: false, errorCode: 'invalid-http-status', error: new Error(`got http status ${this.status}`)})
          return;
        }
      }

      const data = {
        "ks": this._config.ks,
        "service": "elasticsearch_esearch",
        "action": "searchEntry",
      }
      // if(keyword != '') {
      const searchData = {
        // basic search param
        "searchParams:searchOperator:searchItems:item0:searchTerm": keyword,
        "searchParams:objectType": "KalturaESearchEntryParams",
        "searchParams:searchOperator:objectType": "KalturaESearchEntryOperator",
        "searchParams:searchOperator:operator": "1",
        "searchParams:searchOperator:searchItems:item0:objectType": "KalturaESearchUnifiedItem",
        "searchParams:searchOperator:searchItems:item0:itemType": "2",

        // pager
        "pager:objectType": "KalturaPager",
        "pager:pageSize": pageSize,
        "pager:pageIndex": page,

        // order
        "searchParams:orderBy:objectType": "KalturaESearchOrderBy",
        "searchParams:orderBy:orderItems:item0:objectType": "KalturaESearchEntryOrderByItem",
        "searchParams:orderBy:orderItems:item0:sortOrder": "desc",
        "searchParams:orderBy:orderItems:item0:sortField": "created_at"
      }

      xhr.send(serialize({ ...searchData, ...data }));
    });
  }
}
