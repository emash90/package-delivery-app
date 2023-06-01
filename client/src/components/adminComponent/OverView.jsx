import { Card, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../features/auth/authSlice";
import { getAllDeliveries } from "../../features/delivery/deliverySlice";
import { getAllPackages } from '../../features/packages/packageSlice'

function OverView({ }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { allPackages } = useSelector((state) => state.packages)
    const { allDeliveries } = useSelector((state) => state.deliveries)
    const { allUsers } = useSelector((state) => state.auth)
    console.log(allUsers)
    useEffect(() => {
        const fetchAllPackages = () => {
            dispatch(getAllPackages())
        }
        const fetchAllDeliveries = () =>{
            dispatch(getAllDeliveries())
        }
        const fetchAllUsers = () =>{
            dispatch(getAllUsers())
        }
        fetchAllPackages()
        fetchAllDeliveries()
        fetchAllUsers()
    }, [])


    const openPackages = allPackages.filter(
        (pack) => pack.packageStatus === "open"
    );
    const packagesInTransit = allPackages.filter(
        (pack) => pack.packageStatus === "in transit"
    );
    const deliveredPackages = allPackages.filter(
        (pack) => pack.packageStatus === "delivered"
    );
    const failedPackages = allPackages.filter(
        (pack) => pack.packageStatus === "failed"
    );
    const pickedupPackages = allDeliveries.filter(
        (delivery) => delivery.status === "Picked Up"
    );
    const clientUsers = allUsers.filter((user) => user.accountType === 'client')
    const driverUsers = allUsers.filter((user) => user.accountType === 'driver')
    const adminUsers = allUsers.filter((user) => user.accountType === 'admin')
    const delivered = allDeliveries.filter((delivery) => delivery.status === 'delivered')
    const failedDeliveries = allDeliveries.filter((delivery) => delivery.status === 'failed')
    const deliveriesInTransit = allDeliveries.filter((delivery) => delivery.status === 'in transit')
    return (
        <>
            <Row className="summary_card" style={{marginTop: '3rem'}}>
                <Col>
                    <Card className="summary_card">
                        <Card.Header as="h5">Packages: {allPackages.length}</Card.Header>
                        <Card.Body>
                            <Card.Title>Open Packages: {openPackages.length}</Card.Title>
                            <Card.Title>Packages In Transit: {packagesInTransit.length}</Card.Title>
                            <Card.Title>Delivered Packages: {deliveredPackages.length}</Card.Title>
                            <Card.Title>Failed Delivery Packages: <span className="failed-status">{failedPackages.length}</span></Card.Title>
                            <Button href="/admin/packages" variant="primary">View Packages</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col>
                    <Card className="summary_card">
                        <Card.Header as="h5">Deliveries: {allDeliveries.length}</Card.Header>
                        <Card.Body>
                            <Card.Title>Pickedup Deliveries: {pickedupPackages.length}</Card.Title>
                            <Card.Title>Deliveries In Transit: {deliveriesInTransit.length} </Card.Title>
                            <Card.Title>Delivered Packages: {delivered.length}</Card.Title>
                            <Card.Title>Failed Deliveries: <span className="failed-status">{failedDeliveries.length}</span> </Card.Title>
                         
                            <Button href="/admin/deliveries" variant="primary">View Deliveries</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="summary_card">
                        <Card.Header as="h5">Users: {allUsers.length}</Card.Header>
                        <Card.Body>
                            <Card.Title>Admin Users: {adminUsers.length}</Card.Title>
                            <Card.Title>Client Users: {clientUsers.length}</Card.Title>
                            <Card.Title>Driver Users: {driverUsers.length} </Card.Title>
                      
                            <Button href="/admin/users" variant="primary">View Users</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default OverView;
