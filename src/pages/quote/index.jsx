import React, { useEffect, useRef, useState } from "react";
import Container from "../../components/Container";
import { TERipple } from "tw-elements-react";
import {
  Input,
  Button,
  Menu,
  MenuHandler,
  Textarea,
  Select,
  Option,
  Badge,
  Spinner,
  Checkbox,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
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
  const [productsSend, setProductsSend] = useState([]);

  const [service, setService] = useState([
    {
      name: "فيـــلا",
      isChecked: false,
    },
    {
      name: "مــول",
      isChecked: false,
    },
    {
      name: "مــحل",
      isChecked: false,
    },
    {
      name: "شقــة",
      isChecked: false,
    },
  ]);

  const serviceData = [{}];

  const productsList = [
    "نظام إنذار السرقة (Burglar Alarm System): BAS",
    "أجهزة الاستشعار الحركي (Motion Sensors): MS",
    "كاميرات المراقبة (Closed-Circuit Television - CCTV):",
    "أنظمة إنذار الحريق (Fire Alarm Systems): FAS",
    "أنظمة الإنذار الذكية (Smart Alarm Systems): SAS",
    "أنظمة الإنذار بالحركة (Motion Alarm Systems): MAS",
    "أقفال الأمان (Security Locks): SL",
    "أنظمة الإنذار اللاسلكية (Wireless Alarm Systems): WAS",
    "أجهزة استشعار الزجاج (Glass Break Sensors): GBS",
    "أنظمة الإنذار بالباب والنافذة (Door and Window Alarm Systems)",
  ];

  useEffect(() => {
    const data =
      productsList.length > 0 &&
      productsList.map((item, index) => {
        return {
          productName: item,
          isChecked: false,
          num: "1",
        };
      });
    setProductsSend(data.length > 0 && data);
  }, []);

  const [images, setImages] = useState(null);

  const [formLoading, setFormLoading] = useState(false);

  const checkConditions = (arr) => {
    // التحقق من أن جميع العناصر تحتوي على isChecked === false
    const allUnchecked = arr.every((item) => item.isChecked === false);

    if (allUnchecked) {
      return false;
    } else {
      // التحقق من أن جميع العناصر التي isChecked === true لديها num > 1
      const allCheckedWithNumGreaterOne = arr
        ?.filter((item) => item.isChecked === true)
        .every((item) => item.num >= 1);

      return allCheckedWithNumGreaterOne;
    }
  };
  const checkService = (arr) => {
    // التحقق من أن جميع العناصر تحتوي على isChecked === false
    const allUnchecked = arr.every((item) => item.isChecked === false);

    if (allUnchecked) {
      return false;
    } else {
      return true;
    }
  };

  const handleMessage = async (ev) => {
    ev.preventDefault();

    const {
      fullName,
      phone,
      email,
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
    } else if (!checkConditions(productsSend)) {
      return toast.error(
        "يرجى التأكد من اختيار أحد المنتجات، بالإضافة إلى التحقق من العدد. كما يجب أن لا يكون العدد أقل من 1 لأي من المنتجات المختارة."
      );
    } else if (!checkService(service)) {
      return toast.error("رجاءً تأكد من اختيار نوع البناء/الموقع.");
    } else if (numberOfProducts === "" || numberOfProducts <= 0) {
      return toast.error(
        "رجاء اخبرنا كم عدد المنتج الذي تريده؟ علي سبيل المثال 1/2/3 ، لا يمكن ان يكون العدد 0 او سالب"
      );
    }
    //  else if (images === null) {
    //   return toast.error(
    //     "رجاء ارفق بعض الصور لموقعك او مكانك حتي نعرف كيف سنساعدك"
    //   );
    // }
    else if (region === "") {
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

  const typographyStyle = "-mb-3 dark-text text-darkMode-dark950";
  const inputStyle =
    "placeholder:text-gray-200 dark-text text-darkMode-dark950";
  const fieldStyle = "flex flex-col gap-5 text-darkMode-dark950";

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
            className="dark:text-darkMode-dark50 dark:border-white bg-darkMode-dark900 hover:bg-darkMode-dark800 dark:bg-inherit dark:hover:bg-darkMode-dark50 dark:hover:text-darkMode-dark950 duration-300 transition-all"
          >
            قم بزيارة متجرنا
          </Button>
        </Link>
      </div>
      {/* <!-- Right column container with form --> */}
      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-col gap-4 justify-center items-center">
          <p className="dark:text-darkMode-dark50 text-center text-darkMode-dark950 text-2xl font-bold tracking-wider">
            نموذج عرض أسعار
          </p>
          <p className="dark:text-darkMode-dark400 text-center text-darkMode-dark500 text-sm tracking-wide mb-5 w-[90%]">
            أهلا وسهلا بك في نموذج اختيار منتج أو خدمة، سيساعدك هذا النموذج في
            اختيار المنتج المناسب لك
          </p>
        </div>
        <form
          ref={myFrom}
          onSubmit={handleMessage}
          dir="rtl"
          className="flex flex-col gap-2 w-full md:w-[90%] lg:w-[80%] shadow dark:shadow-darkMode-dark50 shadow-darkMode-dark400 p-10"
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
              label="الاسم الأول والأخير"
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
              رقم الجوال
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
                label="رقم الجوال"
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
            <Card className="bg-inherit">
              <List className="flex flex-col gap-2">
                {productsSend?.map((item, index) => (
                  <div
                    className={`flex flex-col lg:flex-row lg:justify-between p-2 gap-2 ${
                      index === productsSend?.length - 1
                        ? ""
                        : " border-b-[2px] border-gray-300"
                    }`}
                    key={index}
                  >
                    <ListItem className="p-0">
                      <label
                        htmlFor={item?.productName}
                        className="flex w-full cursor-pointer items-center px-3 py-2 gap-3 group "
                      >
                        <ListItemPrefix className="mr-3">
                          <Checkbox
                            color="red"
                            id={item?.productName}
                            ripple={false}
                            className="hover:before:opacity-0 dark:border-darkMode-dark50 dark:group-hover:border-darkMode-dark900"
                            containerProps={{
                              className: "p-0",
                            }}
                            checked={item?.isChecked}
                            onChange={(ev) => {
                              const isChecked = ev.target.checked;
                              const existingIndex = productsSend.findIndex(
                                (p) => p.productName === item?.productName
                              );

                              if (existingIndex !== -1) {
                                // إذا وجد العنصر، نقوم بتحديث حالته
                                const updatedProductsSend = [...productsSend];
                                updatedProductsSend[existingIndex] = {
                                  ...item,
                                  isChecked,
                                };
                                setProductsSend(updatedProductsSend);
                              } else {
                                // إذا لم يجد العنصر، نقوم بإضافته
                                setProductsSend([
                                  ...productsSend,
                                  {
                                    ...item,
                                    isChecked,
                                  },
                                ]);
                              }
                            }}
                          />
                        </ListItemPrefix>
                        <Typography
                          color="blue-gray"
                          className="font-medium dark:text-darkMode-dark50 dark:group-hover:text-darkMode-dark900"
                        >
                          {item?.productName}
                        </Typography>
                      </label>
                    </ListItem>
                    <div className="flex justify-end items-center lg:justify-start">
                      {item.isChecked === true && (
                        <input
                          type="number"
                          value={item?.num}
                          onChange={(ev) => {
                            const num = ev.target.value;
                            const existingIndex = productsSend.findIndex(
                              (p) => p.productName === item?.productName
                            );

                            if (existingIndex !== -1) {
                              // إذا وجد العنصر، نقوم بتحديث حالته
                              const updatedProductsSend = [...productsSend];
                              updatedProductsSend[existingIndex] = {
                                ...item,
                                num,
                              };
                              setProductsSend(updatedProductsSend);
                            } else {
                              // إذا لم يجد العنصر، نقوم بإضافته
                              setProductsSend([
                                ...productsSend,
                                {
                                  ...item,
                                  num,
                                },
                              ]);
                            }
                          }}
                          placeholder="عدد المنتج الذي تريده"
                          className="rounded-md text-center font-bold w-fit py-1 focus:outline-none"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </List>
            </Card>
          </div>
          {/* end */}

          {/* <!-- Type of construction/location --> */}
          <div className={`${fieldStyle} mt-2`}>
            <Typography
              variant="h6"
              color="blue-gray"
              className={typographyStyle}
            >
              ما هو نوع البناء / الموقع؟
            </Typography>
            <Card className="w-full bg-inherit">
              <List className="flex flex-col sm:justify-between sm:flex-row">
                {service?.map((item, index) => (
                  <ListItem className="p-0">
                    <label
                      htmlFor={item?.name}
                      className={`${
                        index !== service.length - 1 &&
                        "border-b sm:border-l sm:border-b-0 border-darkMode-dark400 dark:border-darkMode-dark200"
                      } flex w-full gap-2 group cursor-pointer sm:items-center sm:justify-center px-3 pb-3 pt-2 sm:py-2 `}
                    >
                      <ListItemPrefix className="mr-3">
                        <Checkbox
                          id={item?.name}
                          ripple={false}
                          color="red"
                          className="hover:before:opacity-0 dark:border-darkMode-dark50 dark:group-hover:border-darkMode-dark900"
                          containerProps={{
                            className: "p-0",
                          }}
                          checked={item?.isChecked}
                          onChange={(ev) => {
                            const isChecked = ev.target.checked;
                            const existingIndex = service.findIndex(
                              (p) => p.name === item?.name
                            );

                            if (existingIndex !== -1) {
                              // إذا وجد العنصر، نقوم بتحديث حالته
                              const updatedService = [...service];
                              updatedService[existingIndex] = {
                                ...item,
                                isChecked,
                              };
                              setService(updatedService);
                            } else {
                              // إذا لم يجد العنصر، نقوم بإضافته
                              setService([
                                ...service,
                                {
                                  ...item,
                                  isChecked,
                                },
                              ]);
                            }
                          }}
                        />
                      </ListItemPrefix>
                      <Typography
                        color="blue-gray"
                        className="font-medium dark:text-darkMode-dark50 dark:group-hover:text-darkMode-dark900"
                      >
                        {item?.name}
                      </Typography>
                    </label>
                  </ListItem>
                ))}
              </List>
            </Card>
          </div>
          {/* end Type of construction/location */}

          {/*images */}
          <div className="flex flex-col gap-y-2  group">
            <span
              className={`pl-1 text-grbg-gray-700 font-bold dark:text-darkMode-dark50`}
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
                  } h-fit text-sm bg-inherit border-[2px] dark:border-[1px] border-gray-300 text-grbg-gray-700 gap-1 flex items-center justify-center hover:bg-gray-300 hover:text-grbg-gray-700 transition-all duration-200 dark:hover:bg-darkMode-dark800 dark:hover:text-darkMode-dark50 dark:bg-darkMode-dark950 `}
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

                      <span className="dark:text-darkMode-dark50 ">
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
              <label className="dark:text-darkMode-dark50 cursor-pointer overflow-hidden text-center w-full h-10 text-sm bg-inherit border-[3px] dark:border-[1px] border-gray-300 text-grbg-gray-700 rounded-full gap-1 flex items-center justify-center hover:bg-gray-300 hover:text-grbg-gray-700 transition-all duration-200 dark:hover:bg-darkMode-dark800 dark:hover:text-darkMode-dark50 dark:bg-darkMode-dark950">
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

                <span className="dark:text-darkMode-whiteColor50 ">
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
              color={isDarkModeActive ? "green" : "gray"}
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
            className="dark:text-darkMode-dark50 dark:border-white text-xl bg-darkMode-dark900 hover:bg-darkMode-dark800 dark:bg-inherit dark:hover:bg-darkMode-dark50 dark:hover:text-darkMode-dark950 duration-200 transition-all"
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
