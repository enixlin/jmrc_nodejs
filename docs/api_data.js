define({ "api": [
  {
    "type": "get",
    "url": "settle/getSettleRecordDate",
    "title": "取得国际结算量数据的最近日期",
    "name": "getSettleRecordDate",
    "group": "settle",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>易融资各项产品的业务名称.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "type",
            "description": "<p>易融资各项产品的业务表内外标志.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "balance_rmx_c",
            "description": "<p>易融资各项产品的业务当期余额-综合人民币.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"name\": \"信用证\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The id of the User was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "../jmrc_node/routes/SettlementController.js",
    "groupTitle": "settle"
  },
  {
    "type": "post",
    "url": "tf/getProductsTFBalanc",
    "title": "取得贸易融资各项产品的业务量",
    "name": "getProductsTFBalanc",
    "group": "tf",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>查询贸易业务的日期.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>易融资各项产品的业务名称.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "type",
            "description": "<p>易融资各项产品的业务表内外标志.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "balance_rmx_c",
            "description": "<p>易融资各项产品的业务当期余额-综合人民币.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"name\": \"信用证\",\n  \"subject\": \"0105\",\n  \"special\": \"\",\n  \"type\": \"表外\",\n  \"balance_usx_c\": 15909768.92,\n  \"balance_rmx_c\": 112633151.55,\n  \"balance_usx_p\": 52608494.75,\n  \"balance_rmx_p\": 367007425.41\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The id of the User was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "../jmrc_node/routes/TFController.js",
    "groupTitle": "tf"
  }
] });
