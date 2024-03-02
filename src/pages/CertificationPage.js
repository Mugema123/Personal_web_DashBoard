import {
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    MenuItem,
    FormGroup,
    Checkbox,
    Stack,
    Container,
    Select,
    TextField,
    Typography,
  } from '@mui/material';
  import { exportComponentAsPNG } from 'react-component-export-image';
  import { Helmet } from 'react-helmet-async';
  import QRCode from 'react-qr-code';
  import { KeyboardArrowRight } from '@mui/icons-material';
  import { useState, useRef } from 'react';
  import API from 'src/api/_api_';
  import { certificateStyles } from './helpers/certifcate';
  import * as htmlToImage from 'html-to-image';
  import { toast } from 'react-hot-toast';
  import { useSelector } from 'react-redux';
  import html2pdf from 'html2pdf.js';
  import html2canvas from 'html2canvas';
  import ChooseFileImage from 'src/components/Global/files/ChooseFileImage';
  
  const CertificationPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('')
    const [category, setCategory] = useState('');
    const [emailCertificate, setEmailCertificate] = useState(false)
    const [downloadCertificate, setDownloadCertificate] = useState(true);
    const classes = certificateStyles();
    const [isDownloadingImage, setIsDownloadingImage] = useState(false);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const certificateWrapperRef = useRef();
    const [userRegistrationNumber, setUserRegistrationNumber] = useState('')
    // const { currentUser } = useSelector((state) => state.auth.isAuthenticated)
    const [image, setImage] = useState('');
    const [tinNumber, setTinNumber] = useState('');

    const formatDate = date => {
        const options = {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        };
        const formattedDate = new Date(date).toLocaleDateString(
          'en-GB',
          options,
        );
    
        const [day, month, year] = formattedDate.split(' ');
        const dayWithSuffix = day + getOrdinalSuffix(day);
        return `${dayWithSuffix} ${month} ${year}`;
      };
    
      const getOrdinalSuffix = day => {
        if (day >= 11 && day <= 13) {
          return 'th';
        }
    
        switch (day % 10) {
          case 1:
            return 'st';
          case 2:
            return 'nd';
          case 3:
            return 'rd';
          default:
            return 'th';
        }
      };

      const generateRandomRegistrationNumber = async() => {
        const generatedNUmber = await API.get('/certificate/generateRegNumber');
        const regNumber = generatedNUmber?.data?.regNumber;
        return regNumber;
      };

      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const todayDate = `${month}/${day}/${currentYear}`;
      const formattedDate = formatDate(todayDate);
      const validUntilDate = `31st December 2024`;
      const userAbbraviated = fullName
        ?.split(' ')
        .map(word => word[0])
        .join('');
    
      const certificatePayload = {
        certificateOwner: fullName,
        // application: currentUser?._id,
        ownerCategory: category,
        ownerRegNumber: `${userRegistrationNumber}/RUPI/${currentYear}`,
        issuedDate: formattedDate,
        expirationDate: validUntilDate,
      };

      const handleDownloadPNG = async(event) => {
        event.preventDefault();
        setIsDownloadingImage(true);
        try {
          exportComponentAsPNG(certificateWrapperRef, {
            html2CanvasOptions: { useCORS: true, backgroundColor: null },
          }).then(() => {
            setIsDownloadingImage(false);
            API.post('/certificate/saveCertificate', certificatePayload);       
          });
  
          if(email !== "" && emailCertificate) {
            const node = certificateWrapperRef.current;
            const imageDataUrl = await htmlToImage.toPng(node);
            API.post('/certificate/emailCertificate', {
              fullName: fullName,
              email: email,
              fileImage: imageDataUrl,
            }).then((response) => {
              if(response.data.successMessage){
                toast.success(response.data.successMessage)
              }
              if(response.data.message){
                toast.error(response.data.message)
              }
            });
          }
        } catch(error) {

        } finally {
          setFullName('')
          setEmail('')
          setCategory('')
          setImage('') 
        } 
      };

      const handleDownloadPDF = async (event) => {
        event.preventDefault();
        setIsDownloadingPdf(true);
        const element = document.getElementById('downloadWrapper');
      
        try {
          html2canvas(element, { scale: 2 }).then(async(canvas) => {
            const imgData = canvas.toDataURL('image/jpeg', 1);
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = imgHeight / imgWidth;
            const pdfHeight = 8.5 * ratio;
            const opt = {
              margin:       0,
              filename:     `RUPI Certificate for ${fullName}.pdf`,
              image:        { type: 'jpeg', quality: 1 },
              html2canvas:  { scale: 1 },
              jsPDF:        { unit: 'in', format: [8.5, pdfHeight], orientation: 'portrait' }
            };
      
            html2pdf().set(opt).from(element).toPdf().get('pdf').then(async (pdf) => {
              pdf.addImage(imgData, 'JPEG', 0, 0, 8.5, pdfHeight);
              pdf.save(opt.filename);
              setIsDownloadingPdf(false);
              await API.post('/certificate/saveCertificate', certificatePayload);
              await API.post('/certificate/saveRegNumber', {
                regNumber: userRegistrationNumber,
              });
            });
      
            if(email !== "" && emailCertificate) {
              await API.post('/certificate/emailCertificate', {
                fullName: fullName,
                email: email,
                fileImage: imgData,
              }).then((response) => {
                if(response.data.successMessage){
                  toast.success(response.data.successMessage)
                }
                if(response.data.message){
                  toast.error(response.data.message)
                }
              });
            }
          });
        } catch(error) {
          toast.error(error.message);
        } finally {
          setFullName('')
          setEmail('')
          setCategory('')
        }
      };
    
      const encodedId = encodeURIComponent(
        `${userRegistrationNumber}/RUPI/${currentYear}`,
      );
  
    return (
        <>
            <Helmet>
                <title> Certification | MUGEMA Admin</title>
            </Helmet>
            <Container>
            <Stack direction="row" alignItems="center" mb={5}>
                <Typography variant="h4">Provide Certificate</Typography>
            </Stack>
            <form noValidate autoComplete="off">
                <TextField
                label="Full Name"
                color="secondary"
                type='text'
                fullWidth
                required
                sx={{ my: 1 }}
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                />
                <TextField
                label="Email (optional)"
                color="secondary"
                type='email'
                fullWidth
                sx={{ my: 1 }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                />
                <FormControl fullWidth sx={{ my: 1 }}>
                <InputLabel id="demo-simple-select-label">
                    Choose Category
                </InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    onChange={async (e) => {
                      setCategory(e.target.value);
                      setUserRegistrationNumber(await generateRandomRegistrationNumber());
                    }}
                    label="Select Category"
                    required
                >
                    <MenuItem value="Junior">Junior</MenuItem>
                    <MenuItem value="Professional">Professional</MenuItem>
                    <MenuItem value="Consulting">Consulting</MenuItem>
                    <MenuItem value="Company">Company</MenuItem>
                </Select>
                </FormControl>
                {
                  category == 'Company' &&
                  <TextField
                    label="TIN Number"
                    color="secondary"
                    type='text'
                    fullWidth
                    sx={{ my: 1 }}
                    value={tinNumber}
                    onChange={e => setTinNumber(e.target.value)}
                  />
                }
                <ChooseFileImage
                  selected={image}
                  title="User image"
                  onSelect={selected => setImage(selected)}
                />
                
                {
                    fullName !== '' && category !== '' && image !=='' && (  
                    <>
                <Typography fontSize="medium" fontWeight="bold" marginY={2}>
                    Certificate Preview
                </Typography>
                <div className={classes.root}>
                    <div id="downloadWrapper" className={classes.downloadWrapper} ref={certificateWrapperRef}>
                        <div className="relative">
                                {
                                category == 'Junior' ? (
                                    <img
                                        className="block w-full h-auto"
                                        src="/assets/certificates/junior.png"
                                        alt="Junior / Graduate Certificate"
                                    />
                                    ) : category == 'Professional' ? (
                                    <img
                                        className="block w-full h-auto"
                                        src="/assets/certificates/professional.png"
                                        alt="Corporate Certificate"
                                    />
                                    ) : category == 'Company' ? (
                                    <img
                                        className="block w-full h-auto"
                                        src="/assets/certificates/company.png" 
                                        alt="Company Certificate"
                                    />
                                    ) :  (
                                    <img
                                        className="block w-full h-auto"
                                        src="/assets/certificates/consulting.png"
                                        alt="Fellow Certificate"
                                    />
                                    )
                                }
                                
                        {
                          category !== 'Company' &&
                          <img className={classes.certificatePersonName} src={image} alt={fullName}/>
                        }    
                        <Typography
                            className={`${classes.certificateText} ${
                            fullName.length > 28 ? 'long-text' : ''
                            } ${category}`}
                        >
                            {fullName}
                        </Typography>
                        <Typography
                            className={`${classes.certificateDescription} ${
                            category === 'Junior'
                                ? 'junior'
                                :  'other'
                            }`}
                        >
                            <span> Is registered  as a <strong>{category == "Company" ? `CONSULTANCY FIRM ${tinNumber !== '' ? `(${tinNumber})`: ''}` : `${category?.toUpperCase()} URBAN AND REGIONAL PLANNER`}</strong> in the year 2024, 
                            pursuant to and in accordance with the constitution governing the profession 
                            of urban and regional planning in Rwanda and the authorization letter 
                            No 0859/16.01 authorising the Rwanda Urban Planners Institute to officially operate.
                            In witness whereof the common seal has been here to affixed at a meeting of the 
                            governing council held to admit this member.</span>
                        </Typography>
                        <Typography className={classes.registrationNumber}>
                            Registration Number: <Typography variant="body1" color="initial" fontWeight="bold" ml={3}>{userRegistrationNumber}/RUPI/{currentYear}</Typography>
                        </Typography>
                        <Typography className={classes.certificateDate}>
                            Issued date: <Typography variant="body1" color="initial" fontWeight="bold" fontSize="13.5px" ml={3}>{formattedDate}</Typography>
                        </Typography>
                        <Typography className={classes.governingCouncil}>
                            Authorized by: <Typography variant="body1" color="initial" fontWeight="bold" fontSize="13.5px" ml={3}>RUPI Governing Council</Typography>
                        </Typography>
                        <Typography className={classes.validUntilDate}>
                            Valid until: <Typography variant="body1" color="initial" fontWeight="bold" fontSize="13.5px" ml={3}>{validUntilDate}</Typography>
                        </Typography>
                        <div className={classes.qrCodeContainer}>
                            <QRCode
                            value={`${process.env.REACT_APP_WEB_URL}/certificate/${encodedId}`}
                            className={classes.qrCode}
                            />
                        </div>
                        </div>
                    </div>
                    </div>
                    </>
                    )
                }
                <div></div>

                <FormGroup sx={{ my: 3 }}>
                <FormLabel>Available Options</FormLabel>
                {
                    email == "" ?
                    <Typography variant="body1" fontSize="small" fontWeight="bold" marginY={1} color="initial">To email a certificate fill the email field</Typography>
                    :
                    <FormControlLabel 
                        control={
                            <Checkbox
                            checked={emailCertificate}
                            onChange={(event) => setEmailCertificate(event.target.checked)}
                            />
                        }
                        label={`Email this certificate on ${email}`}
                    />
                }
                <FormControlLabel
                    required
                    control={
                        <Checkbox
                        checked={downloadCertificate}
                        onChange={(event) => setDownloadCertificate(event.target.checked)}
                        />
                    }
                        label="Download Certificate"
                />
                </FormGroup>
                <div></div>
                {/* <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={fullName == "" || category == "" | !downloadCertificate}
                onClick={handleDownloadPNG}
                endIcon={
                    isDownloadingImage ? (
                    <CircularProgress size={20} color="inherit" />
                    ) : (
                    <KeyboardArrowRight />
                    )
                }
                >
                    {
                       (email !== "" && emailCertificate) ?
                       "Download as Image and Email Certificate"
                       :
                       "Download as Image" 
                    }
                </Button> */}
                <Button
                type="submit"
                color="secondary"
                variant="contained"
                sx={{ ml: 2 }}
                disabled={fullName == "" || category == "" | !downloadCertificate}
                onClick={handleDownloadPDF}
                endIcon={
                    isDownloadingPdf ? (
                    <CircularProgress size={20} color="inherit" />
                    ) : (
                    <KeyboardArrowRight />
                    )
                }
                >
                    {
                       (email !== "" && emailCertificate) ?
                       "Download and Email Certificate"
                       :
                       "Download" 
                    }
                </Button>
            </form>
          </Container>
       </>
    );
  };
  
  export default CertificationPage;
  