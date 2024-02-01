import React, { useEffect, useRef, useState } from "react";
import Container from "../../components/Container";
import { TERipple } from "tw-elements-react";
import {
  Input,
  Button,
  Typography,
  Menu,
  MenuHandler,
  Textarea,
  Select,
  Option,
  Badge,
  Spinner,
} from "@material-tailwind/react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";

const Quote = ({ isDarkModeActive }) => {
  const selectProducts = useRef();
  const selectRegion = useRef();

  useEffect(() => {
    // start selectProducts
    selectProducts?.current?.children[0]?.children[0]?.classList?.remove(
      "left-3"
    );
    selectProducts?.current?.children[0]?.children[0]?.classList?.add(
      "right-7"
    );

    selectProducts?.current?.children[0]?.children[1]?.classList?.remove(
      "right-2"
    );
    selectProducts?.current?.children[0]?.children[1]?.classList?.add("left-2");
    // end selectProducts

    // start selectRegion
    selectRegion?.current?.children[0]?.children[0]?.classList?.remove(
      "left-3"
    );
    selectRegion?.current?.children[0]?.children[0]?.classList?.add("right-8");

    selectRegion?.current?.children[0]?.children[1]?.classList?.remove(
      "right-2"
    );
    selectRegion?.current?.children[0]?.children[1]?.classList?.add("left-2");
    // end selectRegion
  }, []);

  const myFrom = useRef(null);
  const [message, setMessage] = useState({
    fullName: "",
    phone: "",
    email: "",
    products: "",
    numberOfProducts: "1",
    region: "",
    city: "",
    locationDetails: "",
  });

  const [images, setImages] = useState(null);

  const [formLoading, setFormLoading] = useState(false);

  const handleMessage = async (ev) => {
    ev.preventDefault();

    const {
      fullName,
      phone,
      email,
      products,
      numberOfProducts,
      region,
      city,
      locationDetails,
    } = message;

    const isEmailValid = (email) => {
      // ريجيولر إكسبريشن للتحقق من صحة الإيميل
      const emailRegex = /^[a-z0-9](\.?[a-z0-9]){5,}@(gmail|yahoo)\.com$/;
      return emailRegex.test(email);
    };

    const emailIsValid = isEmailValid(email);
    const isSaudiPhoneNumberValid = (phoneNumber) => {
      // ريجيولر إكسبريشن للتحقق من صحة رقم الهاتف السعودي
      const saudiPhoneNumberRegex =
        /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
      return saudiPhoneNumberRegex.test(phoneNumber);
    };
    // في داخل دالة handleMessage
    const phoneNumberIsValid = isSaudiPhoneNumberValid(phone);

    if (fullName === "") {
      return toast.error("تأكد من كتابة اسمك");
    } else if (!phoneNumberIsValid) {
      return toast.error(
        "خطأ في رقم الهاتف: تأكد أنك تكتب رقم الهاتف بشكل صحيح وبدون مسافات مسبوقا برمز البلد"
      );
    } else if (!emailIsValid) {
      return toast.error("رجاء اكتب إيميلك بشكل صحيح");
    } else if (products === "") {
      return toast.error("تأكد من إختيار المنتج من خانه المنتجات");
    } else if (numberOfProducts === "" || numberOfProducts <= 0) {
      return toast.error(
        "رجاء اخبرنا كم عدد المنتج الذي تريده؟ علي سبيل المثال 1/2/3 ، لا يمكن ان يكون العدد 0 او سالب"
      );
    } else if (images === null) {
      return toast.error(
        "رجاء ارفق بعض الصور لموقعك او مكانك حتي نعرف كيف سنساعدك"
      );
    } else if (region === "") {
      return toast.error("رجاء اكتب منطقتك");
    } else if (city === "") {
      return toast.error("رجاء اكتب مدينتك");
    } else if (locationDetails === "") {
      return toast.error(
        " رجاء اكتب تفاصيل موقعك بشكل صحيح حتي يسهل علينا الوصول إليك!"
      );
    } else {
      let formData = new FormData();

      formData.append("fullName", message.fullName);
      formData.append("phone", message.phone);
      formData.append("email", message.email);
      formData.append("products", message.products);
      formData.append("numberOfProducts", message.numberOfProducts);
      formData.append("region", message.region);
      formData.append("city", message.city);
      formData.append("locationDetails", message.locationDetails);

      Array.from(images).forEach((img) => {
        formData.append("images", img);
      });

      const config = {
        headers: { "content-type": "multipart/form-data" },
      };

      try {
        setFormLoading(true);

        // استخدام toast.promise للإشعارات
        await toast.promise(
          axios.post("http://localhost:3001/send", formData, config),
          {
            loading: "برجاء الانتظار قليلا جاري ارسال رسالتك...",
            success: (res) => {
              setMessage({
                fullName: "",
                phone: "",
                email: "",
                products: "",
                numberOfProducts: "1",
                region: "",
                city: "",
                locationDetails: "",
              });
              setImages(null);
              return `${res.data.message}`;
            },

            error: (error) => {
              console.error(error);
              return (
                `${error.response?.data?.message}` ||
                "فشل ارسال الرسالة.. رجاء حاول مرة أخري"
              );
            },
          }
        );
      } finally {
        setFormLoading(false);
      }
    }
  };

  const typographyStyle = "-mb-3 dark-text";
  const inputStyle = "placeholder:text-gray-200 dark-text";
  const fieldStyle = "flex flex-col gap-5";

  const saudiRigion = [
    "الرياض",
    "الشرقية",
    "مكة",
    "المدينة المنورة",
    "الشرقية",
    "القصيم",
    "حائل",
    "تبوك",
    "الحدود الشمالية",
    "جازان",
    "نجران",
    "الباحة",
    "الجوف",
    "عسير",
  ];

  return (
    <Container className="min-h-screen flex flex-col gap-8">
      <div>
        <Link target="_blank" to={`https://www.al-kaser.com/products`}>
          <Button
            variant={isDarkModeActive ? "outlined" : ""}
            className="dark:text-darkMode-dark50 dark:border-white bg-gray-800 hover:bg-gray-900 dark:bg-inherit dark:hover:bg-darkMode-dark50 dark:hover:text-darkMode-dark950 duration-300 transition-all"
          >
            اذهب الي متجرنا
          </Button>
        </Link>
      </div>
      {/* <!-- Right column container with form --> */}
      <div className="flex flex-col items-center gap-5">
        <p className="dark:text-darkMode-dark50 text-center text-3xl font-bold tracking-wide">
          النموذج
        </p>
        <form
          ref={myFrom}
          onSubmit={handleMessage}
          dir="rtl"
          className="flex flex-col gap-2 w-full sm:w-[80%] md:w-[80%] lg:w-[50%]"
        >
          {/* <!-- full name --> */}
          <div className={`${fieldStyle}`}>
            <Typography
              variant="h6"
              color="blue-gray"
              className={typographyStyle}
            >
              الإسم الكامل
            </Typography>
            <Input
              color={isDarkModeActive ? "green" : "gray"}
              label="الإسم الاول والاخير"
              className={`${inputStyle}`}
              value={message.fullName}
              onChange={(ev) =>
                setMessage({ ...message, fullName: ev.target.value })
              }
              name="name"
            />
          </div>

          {/* <!-- phone  --> */}
          <div className={fieldStyle}>
            <Typography
              variant="h6"
              color="blue-gray"
              className={typographyStyle}
            >
              رقم الهاتف
            </Typography>
            <div className="relative flex">
              <Menu placement="bottom-start">
                <MenuHandler>
                  <Button
                    ripple={false}
                    variant="text"
                    className="dark-text cursor-default flex h-10 items-center gap-2 rounded-l-none border border-l-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg"
                      alt="flag-for-egypt"
                      className="h-4 w-4 rounded-full object-cover"
                    />
                  </Button>
                </MenuHandler>
              </Menu>
              <Input
                type="tel"
                className={`rounded-r-none ${inputStyle} `}
                color={isDarkModeActive ? "green" : "gray"}
                label="رقم الهاتف"
                value={message.phone}
                onChange={(ev) =>
                  setMessage({ ...message, phone: ev.target.value })
                }
                name="phone"
              />
            </div>
          </div>

          {/* <!-- email --> */}
          <div className={fieldStyle}>
            <Typography
              variant="h6"
              color="blue-gray"
              className={typographyStyle}
            >
              البريد الإلكتروني
            </Typography>
            <Input
              color={isDarkModeActive ? "green" : "gray"}
              label="البريد الإلكتروني"
              className={`${inputStyle}`}
              value={message.email}
              onChange={(ev) =>
                setMessage({ ...message, email: ev.target.value })
              }
              name="email"
            />
          </div>

          {/* <!-- المنتجات --> */}
          <div className={fieldStyle}>
            <Typography
              variant="h6"
              color="blue-gray"
              className={typographyStyle}
            >
              المنتجات
            </Typography>
            <div className=" grid  grid-cols-1 sm:grid-cols-2 flex-wrap gap-2 w-full">
              <div className="">
                <Select
                  ref={selectProducts}
                  color={isDarkModeActive ? "green" : "black"}
                  label="إختر المنتج"
                  className=" dark:text-darkMode-dark50"
                  labelProps={{
                    className: "",
                  }}
                  value={message.products}
                  onChange={(value) => {
                    setMessage({ ...message, products: value });
                  }}
                  onClick={() => {
                    setTimeout(() => {
                      selectProducts?.current?.children[0]?.children[1]?.classList?.remove(
                        "right-2"
                      );
                      selectProducts?.current?.children[0]?.children[1]?.classList?.add(
                        "left-2"
                      );
                    }, 1);
                  }}
                  name="products"
                >
                  <Option value="ظام إنذار السرقة (Burglar Alarm System): BAS">
                    نظام إنذار السرقة (Burglar Alarm System): BAS
                  </Option>
                  <Option value="أجهزة الاستشعار الحركي (Motion Sensors): MS">
                    أجهزة الاستشعار الحركي (Motion Sensors): MS
                  </Option>
                  <Option value="كاميرات المراقبة (Closed-Circuit Television - CCTV):">
                    كاميرات المراقبة (Closed-Circuit Television - CCTV):
                  </Option>
                  <Option value="أنظمة إنذار الحريق (Fire Alarm Systems):FAS:">
                    أنظمة إنذار الحريق (Fire Alarm Systems):FAS:
                  </Option>
                  <Option value="أنظمة الإنذار الذكية (Smart Alarm Systems): SAS">
                    أنظمة الإنذار الذكية (Smart Alarm Systems): SAS
                  </Option>
                  <Option value="أنظمة الإنذار بالحركة (Motion Alarm Systems): MAS">
                    أنظمة الإنذار بالحركة (Motion Alarm Systems): MAS
                  </Option>
                  <Option value="أقفال الأمان (Security Locks): SL">
                    أقفال الأمان (Security Locks): SL{" "}
                  </Option>
                  <Option value="أنظمة الإنذار اللاسلكية (Wireless Alarm Systems WAS)">
                    أنظمة الإنذار اللاسلكية (Wireless Alarm Systems WAS)
                  </Option>
                  <Option value="أجهزة استشعار الزجاج (Glass Break Sensors) GBS">
                    أجهزة استشعار الزجاج (Glass Break Sensors) GBS
                  </Option>
                  <Option value="أنظمة الإنذار بالباب والنافذة (Door and Window Alarm Systems)">
                    أنظمة الإنذار بالباب والنافذة (Door and Window Alarm
                    Systems)
                  </Option>
                </Select>
              </div>

              <div className="">
                <Input
                  color={isDarkModeActive ? "green" : "gray"}
                  label="ادخل عدد المنتج الذي تريده"
                  className={`${inputStyle}`}
                  value={message.numberOfProducts}
                  onChange={(ev) =>
                    setMessage({
                      ...message,
                      numberOfProducts: ev.target.value,
                    })
                  }
                  type="number"
                  name="numberOfProducts"
                />
              </div>
            </div>
          </div>
          {/* end */}

          {/*images */}
          <div className="flex flex-col gap-y-2  group">
            <span
              className={`pl-1 text-blue-gray-900 font-bold dark:text-darkMode-dark50`}
            >
              المرفقات
            </span>
            {images ? (
              <Badge
                withBorder
                className="cursor-pointer w-fit transition-all duration-200 bg-gradient-to-tr from-orange-500 to-orange-900 hover:from-orange-800 hover:to-orange-900 border-2 border-white shadow-lg shadow-black/20 "
                content={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                }
                onClick={() => setImages(null)}
              >
                <label
                  className={`cursor-pointer  text-center w-full ${
                    images.length > 0
                      ? "h-fit rounded-md p-2"
                      : "h-10 rounded-full"
                  } h-fit text-sm bg-inherit border-[2px] dark:border-[1px] border-gray-300 text-gray-600 gap-1 flex items-center justify-center hover:bg-gray-300 hover:text-blue-gray-900 transition-all duration-200 dark:hover:bg-darkMode-dark800 dark:hover:text-darkMode-dark50 dark:bg-darkMode-dark950 `}
                >
                  {images.length > 0 ? (
                    <span className="dark:text-darkMode-dark50 flex flex-col h-fit">
                      {Array.from(images).map((file, index) => (
                        <span className="dark:text-darkMode-dark50" key={index}>
                          {file.name}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <div className="dark:text-darkMode-dark50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>

                      <span className="dark:text-darkMode-dark50">
                        اضغط هنا لرفع صور موقعك
                      </span>
                    </div>
                  )}

                  <input
                    type="file"
                    name="images"
                    onChange={(ev) => {
                      // تحقق من أن عدد الملفات المحددة لا يتجاوز 8
                      if (ev.target.files.length <= 8) {
                        // قم بتحديد الصور في حالة عدم تجاوز الحد
                        setImages(ev.target.files);
                      } else {
                        // إذا تجاوز العدد المسموح، إظهار رسالة خطأ
                        toast.error(
                          "لقد حددت اكثر من 8 صور. برجاء تحديد 8 صور فقط او اقل"
                        );
                      }
                    }}
                    className="hidden"
                    multiple
                  />
                </label>
              </Badge>
            ) : (
              <label className="dark:text-darkMode-dark50 cursor-pointer overflow-hidden text-center w-full h-10 text-sm bg-inherit border-[3px] dark:border-[1px] border-gray-300 text-gray-600 rounded-full gap-1 flex items-center justify-center hover:bg-gray-300 hover:text-blue-gray-900 transition-all duration-200 dark:hover:bg-darkMode-dark800 dark:hover:text-darkMode-dark50 dark:bg-darkMode-dark950">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>

                <span className="dark:text-darkMode-whiteColor50">
                  اضغط هنا لرفع صور موقعك
                </span>

                <input
                  type="file"
                  name="images"
                  onChange={(ev) => {
                    // تحقق من أن عدد الملفات المحددة لا يتجاوز 8
                    if (ev.target.files.length <= 8) {
                      // قم بتحديد الصور في حالة عدم تجاوز الحد
                      setImages(ev.target.files);
                    } else {
                      // إذا تجاوز العدد المسموح، يمكنك إضافة رسالة خطأ أو اتخاذ إجراء آخر
                      toast.error(
                        "لقد حددت اكثر من 8 صور. برجاء تحديد 8 صور فقط او اقل"
                      );
                    }
                  }}
                  className="hidden"
                  multiple
                />
              </label>
            )}
          </div>
          {/* end images */}

          {/* <!-- region --> */}
          <div className={fieldStyle}>
            <Typography
              variant="h6"
              color="blue-gray"
              className={typographyStyle}
            >
              ما هي منطقتك؟
            </Typography>

            <Select
              ref={selectRegion}
              color={isDarkModeActive ? "green" : "black"}
              label="اختر المنطقة"
              className=" dark:text-darkMode-dark50"
              labelProps={{
                className: "text-[0.875rem]",
              }}
              value={message.region}
              onChange={(value) => setMessage({ ...message, region: value })}
              onClick={() => {
                setTimeout(() => {
                  selectRegion?.current?.children[0]?.children[1]?.classList?.remove(
                    "right-2"
                  );
                  selectRegion?.current?.children[0]?.children[1]?.classList?.add(
                    "left-2"
                  );
                }, 1);
              }}
              name="flatScreensProducts"
            >
              {saudiRigion?.map((item, index) => (
                <Option
                  className="text-lg tracking-wide"
                  key={index}
                  value={item}
                >
                  {item}
                </Option>
              ))}
            </Select>
          </div>

          {/* <!-- city --> */}
          <div className={fieldStyle}>
            <Typography
              variant="h6"
              color="blue-gray"
              className={typographyStyle}
            >
              ما هي مدينتك؟
            </Typography>
            <Input
              color={isDarkModeActive ? "green" : "gray"}
              label="المدينة _ الحي"
              className={inputStyle}
              value={message.city}
              onChange={(ev) =>
                setMessage({
                  ...message,
                  city: ev.target.value,
                })
              }
              name="city"
            />
          </div>

          {/* <!-- location details --> */}
          <div className={fieldStyle}>
            <Typography
              variant="h6"
              color="blue-gray"
              className={typographyStyle}
            >
              أدخل تفاصيل موقعك
            </Typography>
            <Textarea
              size="lg"
              color={isDarkModeActive ? "green" : "gray"}
              label="تفاصيل موقعك"
              className="mb-6 dark:text-darkMode-dark50"
              value={message.locationDetails}
              onChange={(ev) =>
                setMessage({
                  ...message,
                  locationDetails: ev.target.value,
                })
              }
              name="locationDetails"
            ></Textarea>
          </div>
          {/* end */}

          {/* <!-- Submit button --> */}
          <Button
            type="submit"
            variant={isDarkModeActive ? "outlined" : ""}
            className="dark:text-darkMode-dark50 dark:border-white text-xl bg-gray-800 hover:bg-gray-900 dark:bg-inherit dark:hover:bg-darkMode-dark50 dark:hover:text-darkMode-dark950 duration-200 transition-all"
          >
            {formLoading ? (
              <div className="flex justify-center ">
                <Spinner className="h-6 w-6" />
              </div>
            ) : (
              "إرسال"
            )}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Quote;
