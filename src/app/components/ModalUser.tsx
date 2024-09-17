import React, { useEffect, useState } from "react";
import {
     Button,
     Card,
     CardBody,
     CardFooter,
     CardHeader,
     Chip,
     Divider,
     Link,
     Modal,
     ModalContent,
     useDisclosure,
} from "@nextui-org/react";
import { parseDate, CalendarDate } from "@internationalized/date";
import { User } from "../interface/User";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";

interface ModalUserProps {
     user: User | null;
     isOpen: boolean;
     onClose: () => void;
}

const formatDate = (date: CalendarDate) => {
     if (!date || typeof date !== "object") return "";
     const { year, month, day } = date;
     return `${year}-${month.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`;
};

const getGenderLabel = (genderId: number) => {
     switch (genderId) {
          case 1:
               return "Male";
          case 2:
               return "Female";
          case 3:
               return "ETC.";
          default:
               return "Unknown";
     }
};

const ModalUser: React.FC<ModalUserProps> = ({ user, isOpen, onClose }) => {
     const [userData, setUserData] = useState<User | null>(null);
     const { isOpen: modalIsOpen, onOpen, onOpenChange } = useDisclosure();

     // Fetch user data when modal opens
     useEffect(() => {
          if (isOpen) {
               setUserData(user);
          }
     }, [isOpen]);

     return (
          <Modal isOpen={isOpen} onOpenChange={onClose}>
               <ModalContent>
                    {userData ? (
                         <Card className="w-full -z-1">
                              <CardHeader className="flex gap-3">
                                   <div className="flex flex-col">
                                        <p className="text-md">
                                             {userData.firstName || "User"}{" "}
                                             {userData.lastName || "Name"}
                                        </p>
                                        <p className="text-small text-default-500">
                                             {userData.email ||
                                                  "user@example.com"}
                                        </p>
                                   </div>
                              </CardHeader>
                              <Divider />
                              <CardBody className="p-3 gap-y-3">
                                   <p className="text-md">Contact Details</p>
                                   <p className="text-md mx-2">
                                        <LocalPhoneOutlinedIcon />
                                        <span className="px-3">
                                             {userData.phone || "-"}
                                        </span>
                                   </p>
                                   <div className="mx-2">
                                        <WcOutlinedIcon />
                                        <Chip
                                             className="mx-2 capitalize"
                                             size="md"
                                             variant="flat"
                                        >
                                             {getGenderLabel(userData.gender) ||
                                                  "-"}
                                        </Chip>
                                   </div>
                                   <div className="mx-2">
                                        <CakeOutlinedIcon />
                                        <Chip
                                             className="mx-2 capitalize"
                                             size="md"
                                             variant="flat"
                                        >
                                             {formatDate(userData.birthDate) ||
                                                  "-"}
                                        </Chip>
                                   </div>
                              </CardBody>
                         </Card>
                    ) : (
                         <p>Loading...</p>
                    )}
               </ModalContent>
          </Modal>
     );
};

export default ModalUser;
