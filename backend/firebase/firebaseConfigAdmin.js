import admin from "firebase-admin";
admin.initializeApp({
    credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "aeroponics-e15b0",
    "private_key_id": "85bfefc87196a57099afbb66208dc8d48a49adb8",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDbLEtJz3hRN/eo\nI+ELbgfp0cCteO1bU/oju1zOGkv8/Ao4JnIsjijYqKs6AfSj2VI4jESXl6yjy8Q4\ndf4doog1PZoh3CyX/YtShYegG4wsNGUvwGAeDCgeThZxOzSbAshkKGeB0iEIclVP\n0RV3HK1VqTcSBd/xkQSS0BKtsDx/IxvUtjvq6wCjDv6hJLuWccFYqqvTwkGiSv5S\nQWVPsyeoSLxYplROYly9LwOIsHXWldje4m5/UNuv7bV71TdG8NoEAjWkywqURehO\nRFQnbPs7Yy+a38llOLFVIUwT1/gD54P5eGPaeM8kuZvgYiNdmyNDKyD66AzXjGps\nXmSGGx9hAgMBAAECggEABLqR7UfCqs3wU/piMqLvHMZfx95iEKRhM0AponDCzvSJ\nK+j4camni/UnrJq6MobP1VSBblvhZ69PzoANOYp2Md/gYXakp6raxK8I3BV8EsAW\nps8Zw8wzWWQJ6+uBGQ8YT8Dnas+j0tDUsmIqemVt//kkrQjfahDc7mX64TB6Pav0\nBXj1xO3plpJ+3mDbzfymh6HSx6YJiXipgLOedHKVBNIxmCGVZvI5ozr1+DMS25aV\n1Lgp/ssycSoce506M0mJtFp2BE7U2Q8rtSUxqHoQV0veYzmwIc9/5tmhiO/g422V\n5eEUp5OKRtYFT/qftjBp31/z5Z3Yxlb/ToTIVia6GQKBgQD1TsqClON+iRi09aZW\nZcLb+AK+1TQya84J1y/U+HsBfuBajkgIjKWo4cE2MfrgWTdGipn+5NUV/jccvlf0\nIUExFrrTWQcGC/JVencVOB4MoCv2UuB5XVaDnjludc3cJUhNZADwyVHHFRg370mU\neuxCZYmrNtU3N7DtMOerHTAUtwKBgQDkueJyYsKd5RTOCa/4DAeD7FwsdM++6sZI\nmgFsHouG8t/ML+dAb5wCKvsp0xSfgi1um53CtiYYL58f2cj5L99G0brTIT9IQ4Z9\naBjHJDlrpPRLMBXg9XvCHAOtWyiOaqqPZMTXP3cUqo1yyaOocmlYZRXS5uGE2AXr\nCMEpIKtEpwKBgBmFIuhG2Qv2800QKUffuk/sE00LHS0Jrhuz+VPsrc9QBcMl/jR1\nfV5+bf1XYcQpQ+jgzniIEesB0XX6D2hkdUXIGZOXNXXZlFJ0NSNN/UJO/4PWx2eY\n4EE9Grh1JP98GXODrd1e9FUDyss25668wwt9SL85KyFdd9iVN+TDWpctAoGAFKoa\npFz52kwVGhxT8qQblbaoCTgwgL4zVeHcGQmVb4bH42m8idzLioKZmIjChzq6ohCb\nKzlLrcm3pagGeUTy9jICoAqT7hJztybNfkhui6QmkhhxEZb8LGhdiK8AtgU7DaN8\nCTpppstV5jYDfDeB/wN6+kfzvg3KUxbCZNXXw2cCgYEA5NjJr3Ug/btML8UPvwji\n5N/mf5XojquOZip9/KEMi/wNoZAxe9Oe0cIF5nw5qzz3l//djjp/Ae/dv7hyvi4Z\n7MoxsRoAeuNbwUnhHMsVMa3UkzRo0PVL7zbs0kJbDUEcMJ1PtAwnVEyNDgIuxLHc\nQhZDB7ue90ugkv+x7UC0hUQ=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-xtym6@aeroponics-e15b0.iam.gserviceaccount.com",
    "client_id": "102163859519846152179",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xtym6%40aeroponics-e15b0.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com",
    }),
     databaseURL: "https://aeroponics-e15b0-default-rtdb.asia-southeast1.firebasedatabase.app"
  });
  
  // Export ตัวแปรทั้งหมด
const adminAuth = admin.auth();
const adminDb = admin.firestore();

export {adminAuth , adminDb };